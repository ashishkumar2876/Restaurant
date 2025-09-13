import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { IndianRupee } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
   
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
        setLoading(false);
      });
  }, [sessionId]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-700 dark:text-gray-300 text-lg">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 font-semibold text-lg">{error}</p>
      </div>
    );

  if (!order)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-700 dark:text-gray-300 text-lg">No order found!</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-lg">
        {/* Status */}
        <div className="text-right mb-4">
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Status:{" "}
            <span className="text-[#FF5A5A]">{order.status.toUpperCase()}</span>
          </span>
        </div>

        {/* Order ID */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">
            Order ID:
          </h2>
          <p className="text-gray-700 dark:text-gray-300">{order._id}</p>
        </div>

        {/* Total Amount */}
        <div className="mb-4 flex items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mr-2">
            Total:
          </h2>
          <IndianRupee />
          <span className="ml-1 text-lg font-medium">{order.totalAmount / 100}</span>
        </div>

        {/* Optional: Add more order details here */}
        {/* Example: list of items if available */}
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


