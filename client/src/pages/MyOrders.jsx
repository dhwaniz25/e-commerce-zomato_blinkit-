import React from "react";
import { useSelector } from "react-redux";
import NoData from "../components/NoData";

const MyOrders = () => {
  const orders = useSelector((state) => state.orders.order);
  console.log("Order from my order page", orders);
  return (
    <div>
      <div className="bg-white shadow-md p-3 font-semibold">
        <h1>Order Page</h1>
      </div>
      {!orders[0] && <NoData />}
      {orders.map((order, index) => {
        return (
          <div
            key={order._id + index + "order"}
            className="order rounded p-4 text-sm"
          >
            <p>Order No: {order?.orderId}</p>
            <div className="flex gap-3">
              <img
                src={order.product_details.image[0]}
                alt=""
                className="w-14 h-14"
              />
              <p className="font-semibold">{order.product_details.name}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyOrders;
