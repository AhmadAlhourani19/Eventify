import { NavLink } from "react-router-dom";
import { LayoutDashboard, Calendar, Users, ShoppingCart, QrCode } from "lucide-react";

const Sidebar = () => {
  const links = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/events", label: "Events", icon: <Calendar size={18} /> },
    { to: "/customers", label: "Customers", icon: <Users size={18} /> },
    { to: "/orders", label: "Orders", icon: <ShoppingCart size={18} /> },
    { to: "/checkins", label: "Check-Ins", icon: <QrCode size={18} /> },
  ];

  return (
    <aside className="h-screen w-60 bg-gray-900 text-gray-100 flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-gray-700">EventAdmin</div>
      <nav className="flex-1 p-2 space-y-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md transition ${
                isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
