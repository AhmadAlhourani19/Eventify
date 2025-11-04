const Navbar = () => (
  <header className="h-14 bg-white border-b flex items-center justify-between px-6">
    <h1 className="font-semibold text-gray-700">Admin Dashboard</h1>
    <button className="text-sm bg-gray-800 text-white px-3 py-1.5 rounded-md hover:bg-gray-700">
      Logout
    </button>
  </header>
);

export default Navbar;