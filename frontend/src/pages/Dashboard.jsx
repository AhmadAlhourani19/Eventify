import { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import Chart from "../components/Chart";
import { api } from "../lib/api";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.listEvents(),
      api.searchCustomers(""), // fetch all customers
    ]).then(([eventsData, customersData]) => {
      setEvents(eventsData);
      setCustomers(customersData);
      setLoading(false);
    });
  }, []);

  const chartData = [
    { day: "Mon", sales: 12 },
    { day: "Tue", sales: 9 },
    { day: "Wed", sales: 14 },
    { day: "Thu", sales: 18 },
    { day: "Fri", sales: 22 },
    { day: "Sat", sales: 31 },
    { day: "Sun", sales: 27 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DashboardCard title="Total Events" value={events.length || 0} />
        <DashboardCard title="Tickets Sold" value="254" />
        <DashboardCard title="Revenue" value="$12,400" />
        <DashboardCard title="Customers" value={customers.length || 0} />
      </div>

      <Chart data={chartData} />

      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-gray-700 font-medium mb-3">Recent Events</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left text-gray-500">
                <th className="py-2">Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {events.slice(0, 5).map((e) => (
                <tr key={e.event_id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{e.name}</td>
                  <td>{new Date(e.start_at).toLocaleDateString()}</td>
                  <td>{e.is_published ? "Published" : "Draft"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
