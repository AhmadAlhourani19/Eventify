const DashboardCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center">
    <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
    <p className="text-2xl font-semibold">{value}</p>
  </div>
);

export default DashboardCard;