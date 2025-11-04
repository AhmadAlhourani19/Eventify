import { useState } from "react";
import { api } from "../lib/api";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const search = async () => {
    const data = await api.searchCustomers(query);
    setCustomers(data);
  };

  const create = async (e) => {
    e.preventDefault();
    await api.createCustomer(form);
    setForm({ name: "", email: "", phone: "" });
    search();
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Customers</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded-md flex-1"
        />
        <button onClick={search} className="bg-blue-600 text-white px-3 rounded-md">
          Search
        </button>
      </div>

      <form onSubmit={create} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded-md"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 rounded-md"
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border p-2 rounded-md"
          required
        />
        <button className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700">
          Add
        </button>
      </form>

      <table className="w-full bg-white rounded-xl shadow text-sm">
        <thead className="border-b bg-gray-50">
          <tr className="text-left text-gray-600">
            <th className="p-2">Name</th>
            <th>Email</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.customer_id} className="border-b hover:bg-gray-50">
              <td className="p-2">{c.name}</td>
              <td>{c.email}</td>
              <td>{new Date(c.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
