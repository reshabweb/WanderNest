import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../App";
import { Home as HomeIcon, Heart, User, LogOut, PlusCircle, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "text-red-500 border-red-500" : "text-gray-600 border-transparent hover:text-gray-900";
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-red-500 font-bold text-2xl tracking-tight">
          <HomeIcon className="h-7 w-7 stroke-[2.5]" />
          <span>WanderNest</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex h-full items-center gap-6">
          <Link
            to="/"
            className={`flex items-center gap-1.5 h-full px-1 border-b-2 font-medium text-sm transition-all duration-200 ${isActive("/")}`}
          >
            Explore
          </Link>

          {isLoggedIn && user?.userType === "guest" && (
            <Link
              to="/favourites"
              className={`flex items-center gap-1.5 h-full px-1 border-b-2 font-medium text-sm transition-all duration-200 ${isActive("/favourites")}`}
            >
              <Heart className="h-4 w-4 fill-current" />
              Favourites
            </Link>
          )}

          {isLoggedIn && user?.userType === "host" && (
            <>
              <Link
                to="/host/homes"
                className={`flex items-center gap-1.5 h-full px-1 border-b-2 font-medium text-sm transition-all duration-200 ${isActive("/host/homes")}`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/host/add-home"
                className={`flex items-center gap-1.5 h-full px-1 border-b-2 font-medium text-sm transition-all duration-200 ${isActive("/host/add-home")}`}
              >
                <PlusCircle className="h-4 w-4" />
                Add Home
              </Link>
            </>
          )}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-gray-100 py-1.5 px-3 rounded-full">
                <User className="h-4 w-4 text-gray-500" />
                Hi, {user.firstName} ({user.userType})
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-red-500 bg-white hover:bg-red-50 border border-gray-300 hover:border-red-200 py-1.5 px-3 rounded-lg transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-3 py-1.5"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg shadow-sm transition-all duration-200"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
