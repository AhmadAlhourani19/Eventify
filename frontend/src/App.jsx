import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import CheckIns from "./pages/CheckIns";

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-100">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/checkins" element={<CheckIns />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
