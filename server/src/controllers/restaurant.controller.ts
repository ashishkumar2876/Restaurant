import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import {Multer} from 'multer'
import uploadImageOnCloudinary from "../utils/imageUpload";
import { Order } from "../models/order.model";

export const createRestaurant=async (req:Request,res:Response): Promise<void>=>{
    try {
        const {restaurantName,city,country,deliveryTime,cuisines}=req.body;
        const file=req.file!;
        const restaurant=await Restaurant.findOne({
            user:req.id
        })
        if(restaurant){
            res.status(400).json({
                success:false,
                message:"Restaurant already exist"
            })
            return;
        }
        if(!file){
            res.status(400).json({
                success:false,
                message:"Image is required"
            })
           return;
        }

        const imageUrl=await uploadImageOnCloudinary(file as Express.Multer.File);
        await Restaurant.create({
            user:req.id,
            restaurantName,
            city,
            country,
            deliveryTime,
            cuisines:JSON.parse(cuisines),
            imageUrl,
        })

        res.status(201).json({
            success:true,
            message:"Restaurant added"
        });
        return;
    } catch (error) {
        
        res.status(500).json({
            message:"Internal server error"
        })
        return;
    }
}
export const getRestaurant=async(req:Request,res:Response):Promise<void>=>{
    try {
        const restaurant=await Restaurant.findOne({user:req.id}).populate('menus');
        if(!restaurant){
            res.status(404).json({
                success:false,
                restaurant:[],
                message:"Restaurant not found"
            })
            return;
        };
        res.status(200).json({
            success:true,
            data:restaurant
        });
        return;
    } catch (error) {
        
        res.status(500).json({
            message:"Internal server error"
        })
        return;
    }
}
export const updateRestaurant=async(req:Request,res:Response):Promise<void>=>{
    try {

        const {restaurantName,city,country,deliveryTime,cuisines}=req.body;
        const file=req.file;
        const restaurant=await Restaurant.findOne({user:req.id});
        if(!restaurant){
            res.status(404).json({
                success:false,
                message:"Restaurant not found"
            });
            return;
        }


        restaurant.restaurantName=restaurantName;
        restaurant.city=city;
        restaurant.country=country;
        restaurant.deliveryTime=deliveryTime;
        restaurant.cuisines=JSON.parse(cuisines);

        if(file){
            const imageUrl=await uploadImageOnCloudinary(file as Express.Multer.File);
            restaurant.imageUrl=imageUrl;
        }
        await restaurant.save();
        res.status(200).json({
            success:true,
            restaurant,
            message:"Restaurant updated success"
        });
        return;
                
    } catch (error) {
        
        res.status(500).json({
            message:"Internal server error"
        })
        return;
    }
}

export const getRestaurantOrders=async (req:Request,res:Response):Promise<void>=>{
    try {
        const restaurant=await Restaurant.findOne({user:req.id}).lean();
        
        if(!restaurant){
            res.status(404).json({
                success:false,
                message:"Restaurant not found"
            });
            return;
        }

        const orders=await Order.find({restaurant:restaurant._id}).populate('restaurant').populate('user').lean();
        res.status(200).json({
            success:true,
            data:orders
        });
        return;


    } catch (error) {
        
        res.status(500).json({
            message:"Internal server error"
        })
        return;
    }
}

export const updateOrderStatus=async (req:Request,res:Response):Promise<void>=>{
    try {
        const {orderId}=req.params;
        const {status}=req.body;
        const order=await Order.findOne({_id:orderId});
       

        if(!order){
            res.status(404).json({
                success:false,
                message:"Order not found"
            });
            return;
        }
        order.status=status;
        order.save();

        
        res.status(200).json({
            success:true,
            status:order.status,
            message:"Order is updated successfully"
        });
        return;

    } catch (error) {
        
      res.status(500).json({
            message:"Internal server error"
        })
        return;
    }
}

export const searchRestaurant = async (req: Request, res: Response):Promise<any> => {
    try {
        const searchText = req.params.searchText || "";
        const searchQuery = req.query.searchQuery as string || "";
        const selectedCuisines = (req.query.selectedCuisines as string || "").split(",").filter(cuisine => cuisine);
        const query: any = {};
        // basic search based on searchText (name ,city, country)
        
        if (searchText) {
            query.$or = [
                { restaurantName: { $regex: searchText, $options: 'i' } },
                { city: { $regex: searchText, $options: 'i' } },
                { country: { $regex: searchText, $options: 'i' } },
            ]
        }
        // filter on the basis of searchQuery
        if (searchQuery) {
            query.$or = [
                { restaurantName: { $regex: searchQuery, $options: 'i' } },
                { cuisines: { $regex: searchQuery, $options: 'i' } }
            ]
        }
        
        // ["momos", "burger"]
        if(selectedCuisines.length > 0){
            query.$or =[
                {cuisines:{$in:selectedCuisines}}
            ]
        }
        
        
        const restaurants = await Restaurant.find(query);
        
        return res.status(200).json({
            success:true,
            data: restaurants
        });
    } catch (error) {
        
        return res.status(500).json({ message: "Internal server error" })
    }
}


export const getSingleRestaurant=async (req:Request,res:Response):Promise<void>=>{
    try {
        const restaurantId=req.params.id;
        const restaurant=await Restaurant.findById(restaurantId).populate({
            path:'menus',
            options:{
                createdAt:-1
            }
        });

        if(!restaurant){
            res.status(404).json({
                success:false,
                message:"No restaurant found"
            })
            return;
        }
        res.status(200).json({
            success:true,
            data:restaurant
        });
        return;
    } catch (error) {
        
        res.status(500).json({
            message:"Internal server error"
        })
        return;
    }
}