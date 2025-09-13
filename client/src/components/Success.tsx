import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No session_id found in URL");
      setLoading(false);
      return;
    }

    fetch(`https://your-backend-url.com/api/orders/verify?session_id=${sessionId}`)
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Order Confirmation</h1>
      <p>Order ID: {order._id}</p>
      <p>Status: {order.status}</p>
      <p>Total: ₹{order.totalAmount / 100}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default Success;

