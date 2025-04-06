
import { IndianRupee } from "lucide-react";
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect } from "react";
import { CartItem } from "@/types/cartType";
const Success = () => {
  const { orders, getOrderDetails } = useOrderStore();
  useEffect(() => {
    getOrderDetails();
  }, []);
  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300">
          No order found!
        </h1>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-lg w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Order Status:{" "}
            <span className="text-[#FF5A5A]">{"confirm".toUpperCase()}</span>
          </h1>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Order Summary
          </h2>
          {orders.map((order: any, index: number) => (
            <div key={index}>
              {order.cartItems.map((item: CartItem) => (
                <div className="mb-4 flex justify-between items-center ">
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      className="w-14 h-14 rounded-md object-cover "
                    />
                    <h3 className="ml-4 text-gray-800 dark:text-gray-200">
                      {item.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-800 dark:text-gray-200 flex items-center">
                      <IndianRupee />
                      <span className="text-lg font-medium">{item.price}</span>
                    </div>
                    <Separator className="my-4" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <Link to={"/cart"}>
          <Button className="bg-[#D19254] hover:bg-[#d18c47] w-full py-3 rounded-md shadow-lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
