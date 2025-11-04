import { useState } from "react";
import { api } from "../lib/api";

const Orders = () => {
  const [customerId, setCustomerId] = useState("");
  const [orderId, setOrderId] = useState(null);

  const createOrder = async (e) => {
    e.preventDefault();
    const result = await api.createOrder(Number(customerId));
    setOrderId(result.order_id);
  };

  const payOrder = async () => {
    const items = [{ event_ticket_type_id: 1, quantity: 2 }];
    const payload = { method: "credit_card", status: "succeeded", items };
    await api.payOrder(orderId, payload);
    alert("Payment successful!");
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Orders</h2>

      <form onSubmit={createOrder} className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="border p-2 rounded-md"
          required
        />
        <button className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700">
          Create Order
        </button>
      </form>

      {orderId && (
        <div className="mt-4 bg-white shadow p-4 rounded-md">
          <p className="text-sm mb-2">Order #{orderId}</p>
          <button
            onClick={payOrder}
            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
          >
            Pay Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
