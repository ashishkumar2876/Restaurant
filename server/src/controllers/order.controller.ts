import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Order } from "../models/order.model";
import Stripe from 'stripe';
import dotenv from 'dotenv';


dotenv.config({});

const stripe=new Stripe(process.env.STRIPE_SECRET_KEY!);

type CheckoutSessionRequest={
    cartItems:{
        menuId:string,
        name:string,
        image:string,
        price:number,
        quantity:number
    }[],
    deliveryDetails:{
        name:string,
        email:string,
        address:string,
        city:string
    },
    restaurantId:string
}

export const getOrders=async (req:Request,res:Response):Promise<void>=>{
    try {
        const orders=await Order.find({
            user:req.id
        }).populate('user').populate('restaurant');

        res.status(200).json({
            success:true,
            orders
        });
        return;
    } catch (error) {
       
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
        return;
    }
}
export const createCheckoutSession=async (req:Request,res:Response):Promise<void>=>{
    try {
        const checkoutSessionRequest:CheckoutSessionRequest=req.body;
        const restaurant=await Restaurant.findById(checkoutSessionRequest.restaurantId).populate('menus');

        if(!restaurant){
            res.status(404).json({
                success:false,
                message:"Restaurant not found"
            })
            return;
        }

        const order=new Order({
            restaurant:restaurant._id,
            user:req.id,
            deliveryDetails:checkoutSessionRequest.deliveryDetails,
            cartItems:checkoutSessionRequest.cartItems,
            status:"pending"
        });

        const menuItems=restaurant.menus;
        const lineItems=createLineItems(checkoutSessionRequest,menuItems);

        const session=await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            shipping_address_collection:{
                allowed_countries:['GB','US','CA','IN']
            },
            line_items:lineItems,
            mode:'payment',
            success_url: `https://restaurant-2-4xp5.onrender.com/order/status?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `https://restaurant-2-4xp5.onrender.com/cart`,
            metadata:{
                orderId:order._id.toString(),
                images:JSON.stringify(menuItems.map((item:any)=>item.image))
            }
        })

        
        if(!session.url){
            res.status(400).json({
                success:false,
                message:"Error while creating session"
            })
            return;
        }

        await order.save();

        res.status(200).json({
            success:true,
            session
        });
        return;

    } catch (error) {
        
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
        return;
    }
}
export const stripeWebhook = async (req: Request, res: Response):Promise<void> => {
    let event;

    try {
        const signature = req.headers["stripe-signature"];

        // Construct the payload string for verification
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET!;

        // Generate test header string for event construction
        const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
        });

        // Construct the event using the payload string and header
        event = stripe.webhooks.constructEvent(payloadString, header, secret);
    } catch (error: any) {
        
        res.status(400).send(`Webhook error: ${error.message}`);
        return;
    }

    // Handle the checkout session completed event
    if (event.type === "checkout.session.completed") {
        try {
            const session = event.data.object as Stripe.Checkout.Session;
            const order = await Order.findById(session.metadata?.orderId);

            if (!order) {
                 res.status(404).json({ message: "Order not found" });
                 return;
            }

            // Update the order with the amount and status
            if (session.amount_total) {
                order.totalAmount = session.amount_total;
            }
            order.status = "confirmed";

            await order.save();
        } catch (error) {
            
            res.status(500).json({ message: "Internal Server Error" });
            return;
        }
    }
    // Send a 200 response to acknowledge receipt of the event
    res.status(200).send();
};


export const createLineItems=(checkoutSessionRequest:CheckoutSessionRequest,menuItems:any)=>{
    const lineItems=checkoutSessionRequest.cartItems.map((cartItem)=>{
        const menuItem=menuItems.find((item:any)=>item._id.toString()===cartItem.menuId);
        if(!menuItem){
            throw new Error("Menu id is not found");
        }
        return {
            price_data:{
                currency:'inr',
                product_data:{
                    name:menuItem.name,
                    images:[menuItem.image]
                },
                unit_amount:menuItem.price*100
            },
            quantity:cartItem.quantity,
        }
    })
    return lineItems;
}
export const verifyOrder = async (req: Request, res: Response) => {
  const { session_id } = req.query;

  if (!session_id || typeof session_id !== "string") {
    return res.status(400).json({
      success: false,
      message: "session_id query parameter is required",
    });
  }

  try {
    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Extract orderId from metadata
    const orderId = session.metadata?.orderId;
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID not found in Stripe session metadata",
      });
    }

    // Find order in DB
    const order = await Order.findById(orderId)
      .populate("restaurant")
      .populate("user");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Send order data to frontend
    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error verifying order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify order",
    });
  }
};
