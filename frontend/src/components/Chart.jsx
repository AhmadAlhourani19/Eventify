import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Chart = ({ data }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <h3 className="text-gray-700 text-sm mb-2">Ticket Sales</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default Chart;