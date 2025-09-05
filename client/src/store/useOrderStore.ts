import { CheckoutSessionRequest, OrderState } from "@/types/orderType";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT="https://restaurant-website-wnu3.onrender.com/api/v1/order";

axios.defaults.withCredentials=true;

export const useOrderStore = create<OrderState>()(
  persist((set) => ({
    loading:false,
    orders:[],
    createCheckOutSession:async(checkoutSession:CheckoutSessionRequest)=>{
      try {
        set({loading:true});
        const response=await axios.post(`${API_END_POINT}/checkout/create-checkout-session`,checkoutSession,{
          headers:{
            "Content-Type":"application/json"
          }
        })
        if(response.data.success){
          set({loading:false});
          const session=response.data.session;
          window.location.href=session.url;
        }
      } catch (error) {
        set({loading:false});
      }
    },
    getOrderDetails: async ()=>{
      try {
        set({loading:true});
        const response=await axios.get(`${API_END_POINT}/`);
        set({loading:false,orders:response.data.orders});

      } catch (error) {
        set({loading:false});
      }
    },
  }), {
    name: "order-name",
    storage: createJSONStorage(() => localStorage),
  })
);
