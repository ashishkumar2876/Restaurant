import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { IndianRupee } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useOrderStore } from "@/store/useOrderStore"; // Assuming you're using this store for fetching all orders

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // State for a single order verification
  const [order, setOrder] = useState(null);
  
  const [error, setError] = useState(null);

  // State for fetching all orders
  const { orders, getOrderDetails } = useOrderStore();
  
  // Fetch all orders if there's no sessionId
  useEffect(() => {
    if (!sessionId) {
      getOrderDetails();
    }
  }, [sessionId, getOrderDetails]);

  // Fetch single order if sessionId exists
  useEffect(() => {
    if (sessionId) {
      fetch(`https://restaurant-nkif.onrender.com/api/v1/order/verify?session_id=${sessionId}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setOrder(data.order);
          } else {
            setError(data.message || "Failed to fetch order");
          }
        })
        .catch(() => {
          setError("Failed to fetch order");
        })
        .finally(() => {
        });
    }
  }, [sessionId]);


  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 font-semibold text-lg">{error}</p>
      </div>
    );
  }

  // Single Order Display (If sessionId exists)
  if (order) {
    return (
      <div className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6 space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-lg">
          {/* Order Status */}
          <div className="text-right mb-4">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Status:{" "}
              <span className="text-[#FF5A5A]">{order.status.toUpperCase()}</span>
            </span>
          </div>

          {/* Order ID */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">Order ID:</h2>
            <p className="text-gray-700 dark:text-gray-300">{order._id}</p>
          </div>

          {/* Total Amount */}
          <div className="mb-4 flex items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mr-2">Total:</h2>
            <IndianRupee />
            <span className="ml-1 text-lg font-medium">{order.totalAmount/100}</span>
          </div>

          {/* Cart Items */}
          {order.cartItems && order.cartItems.length > 0 && (
            <>
              <Separator className="my-4" />
              <div>
                {order.cartItems.map((item, i) => (
                  <div key={i} className="mb-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-md object-cover"
                      />
                      <h3 className="ml-4 text-gray-800 dark:text-gray-200">{item.name}</h3>
                    </div>
                    <div className="text-right flex items-center">
                      <IndianRupee />
                      <span className="ml-1 text-lg font-medium">{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <Separator className="my-4" />

          {/* Continue Shopping Button */}
          <Link to="/cart">
            <Button className="bg-[#D19254] hover:bg-[#d18c47] w-full py-3 rounded-md shadow-lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // All Orders Display (If no sessionId)
  return (
  <div className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6 space-y-6">
    {orders.length === 0 ? (
      <p className="text-gray-700 dark:text-gray-300 text-lg">No orders found!</p>
    ) : (
      orders.map((order, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-lg mb-6">
          <div className="text-right mb-4">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Status:{" "}
              <span className="text-[#FF5A5A]">{order.status.toUpperCase()}</span>
            </span>
          </div>

          {/* Order ID */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">Order ID:</h2>
            <p className="text-gray-700 dark:text-gray-300">{order._id}</p>
          </div>

          {/* Total Amount */}
          <div className="mb-4 flex items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mr-2">Total:</h2>
            <IndianRupee />
            <span className="ml-1 text-lg font-medium">{order.totalAmount/100}</span>
          </div>

          {/* Cart Items */}
          {order.cartItems && order.cartItems.length > 0 && (
            <div className="space-y-4">
              {order.cartItems.map((item, i) => {
                // Use fallback image if item.image is not available
                const imageUrl = item.image || "/path/to/default-image.jpg"; // replace with your fallback image path
                return (
                  <div key={i} className="flex items-center space-x-4">
                    <img
                      src={imageUrl} // Image URL for the dish
                      alt={item.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-gray-800 dark:text-gray-200 text-lg font-semibold">{item.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                    </div>
                    <div className="text-right flex items-center">
                      <IndianRupee />
                      <span className="ml-1 text-lg font-medium">{item.price}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Separator className="my-4" />
        </div>
      ))
    )}

    <Link to="/cart">
      <Button className="bg-[#D19254] hover:bg-[#d18c47] w-full py-3 rounded-md shadow-lg">
        Continue Shopping
      </Button>
    </Link>
  </div>
);

};

export default Success;



