import React, {
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/useUserStore";
import { CheckoutSessionRequest } from "@/types/orderType";
import { useCartStore } from "@/store/useCartStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { useOrderStore } from "@/store/useOrderStore";
import { Loader2 } from "lucide-react";

const CheckoutConfirmPage = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { createCheckOutSession, loading } = useOrderStore();
  const { user } = useUserStore();
  const [input, setInput] = useState({
    name: user?.fullname || "",
    email: user?.email || "",
    contact: user?.contact.toString() || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
  });
  const { cart } = useCartStore();
  const { restaurant } = useRestaurantStore();
  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  const checkoutHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //implement the api
    try {
      const checkoutData: CheckoutSessionRequest = {
        cartItems: cart.map((cartItem) => ({
          menuId: cartItem._id,
          name: cartItem.name,
          image: cartItem.image,
          price: cartItem.price.toString(),
          quantity: cartItem.quantity.toString(),
        })),
        deliveryDetails: input,
        restaurantId: restaurant?._id as string,
      };
      await createCheckOutSession(checkoutData);
    } catch (error) {
      
    }
   
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle className="font-bold">Review Your Order</DialogTitle>
        <DialogDescription className="text-xs">
          Double-check your delivery details and ensure everything is in
          order.When you are ready, hit confirm button to finalize your order.
        </DialogDescription>
        <form
          onSubmit={checkoutHandler}
          action=""
          className="md:grid grid-cols-2 gap-2 space-y-1 md:space-y-0"
        >
          <div className="flex flex-col gap-1">
            <Label>Fullname</Label>
            <Input
              type="text"
              name="name"
              value={input.name}
              onChange={changeEventHandler}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              disabled
              value={input.email}
              onChange={changeEventHandler}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Contact</Label>
            <Input
              type="text"
              name="contact"
              value={input.contact}
              onChange={changeEventHandler}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Address</Label>
            <Input
              type="text"
              name="address"
              value={input.address}
              onChange={changeEventHandler}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>City</Label>
            <Input
              type="text"
              name="city"
              value={input.city}
              onChange={changeEventHandler}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Country</Label>
            <Input
              type="text"
              name="country"
              value={input.country}
              onChange={changeEventHandler}
            />
          </div>
          <DialogFooter className="mt-5">
            {loading ? (
              <Button
                disabled
                type="submit"
                className="w-full bg-[#D19254] hover:bg-[#d18c47]"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-[#D19254] hover:bg-[#d18c47]"
              >
                Continue to payment
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutConfirmPage;
