import { Link, useNavigate } from "react-router-dom";
import {
  HandPlatter,
  Loader2,
  Menu,
  Moon,
  PackageCheck,
  ShoppingCart,
  SquareMenu,
  Sun,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { user, loading, logout } = useUserStore();
  const { cart } = useCartStore();
  const [isDark, setIsDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between h-14">
        {/* Logo */}
        <Link to="/">
          <h1 className="font-bold md:font-extrabold text-2xl">AshishEats</h1>
        </Link>

        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-[#D19254]">Home</Link>
            <Link to="/profile" className="hover:text-[#D19254]">Profile</Link>
            <Link to="/order/status" className="hover:text-[#D19254]">Order</Link>

            {user?.admin && (
              <div className="relative">
                <button
                  onClick={() => setDashboardOpen(!dashboardOpen)}
                  className="hover:text-[#D19254]"
                >
                  Dashboard
                </button>
                {dashboardOpen && (
                  <div className="absolute mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                    <Link
                      to="/admin/restaurant"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Restaurant
                    </Link>
                    <Link
                      to="/admin/menu"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Menu
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Orders
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full border hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative cursor-pointer">
              <ShoppingCart />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 h-5 w-5 flex items-center justify-center text-xs rounded-full bg-red-500 text-white">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-sm">
                  CN
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-[#D19254] hover:bg-[#d18c47] text-white"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  <span>Please wait</span>
                </div>
              ) : (
                "Logout"
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navbar Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-full bg-gray-200 text-black hover:bg-gray-300"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 shadow-lg p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h1
                className="cursor-pointer font-bold text-xl"
                onClick={() => {
                  setMobileOpen(false);
                }}
              >
                AshishEats
              </h1>
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full border hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDark ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            </div>

            <nav className="flex flex-col gap-2 flex-1">
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <User /> Profile
              </Link>
              <Link
                to="/order/status"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <HandPlatter /> Order
              </Link>
              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <ShoppingCart /> Cart({cart.length})
              </Link>

              {user?.admin && (
                <>
                  <Link
                    to="/admin/menu"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <SquareMenu /> Menu
                  </Link>
                  <Link
                    to="/admin/restaurant"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <UtensilsCrossed /> Restaurant
                  </Link>
                  <Link
                    to="/admin/orders"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <PackageCheck /> Restaurant Orders
                  </Link>
                </>
              )}
            </nav>

            <div className="mt-auto">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-sm">
                      CN
                    </div>
                  )}
                </div>
                <h1 className="font-bold">Ashish Mernstack</h1>
              </div>
              <button
                onClick={logout}
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg bg-[#D19254] hover:bg-[#d18c47] text-white"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    <span>Please wait</span>
                  </div>
                ) : (
                  "Logout"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
