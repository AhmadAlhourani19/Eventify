import { useState } from "react";
import { api } from "../lib/api";

const CheckIns = () => {
  const [ticketCode, setTicketCode] = useState("");
  const [staffId, setStaffId] = useState("");
  const [result, setResult] = useState(null);

  const checkIn = async (e) => {
    e.preventDefault();
    try {
      const res = await api.checkIn(ticketCode, staffId);
      setResult({ success: true, data: res });
    } catch (err) {
      setResult({ success: false, message: err.message });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Ticket Check-In</h2>

      <form onSubmit={checkIn} className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Ticket Code"
          value={ticketCode}
          onChange={(e) => setTicketCode(e.target.value)}
          className="border p-2 rounded-md flex-1"
          required
        />
        <input
          type="text"
          placeholder="Staff ID (optional)"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          className="border p-2 rounded-md flex-1"
        />
        <button className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700">
          Check In
        </button>
      </form>

      {result && (
        <div
          className={`p-4 rounded-md ${
            result.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {result.success ? (
            <p>✅ Ticket successfully checked in.</p>
          ) : (
            <p>❌ {result.message}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckIns;
