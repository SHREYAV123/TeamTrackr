import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItem = (path, label) => {
    const active = location.pathname === path;

    return (
      <Link
        to={path}
        className={`relative px-3 py-2 text-sm font-medium transition ${
          active
            ? "text-white"
            : "text-gray-400 hover:text-white"
        }`}
      >
        {label}

        {/* Active underline */}
        {active && (
          <span className="absolute left-0 bottom-0 w-full h-[2px] bg-indigo-500 rounded"></span>
        )}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-slate-900 border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/dashboard"
          className="text-xl font-bold text-indigo-400 tracking-tight"
        >
          Team<span className="text-white">Trackr</span>
        </Link>

        {/* Center Nav */}
        {user && (
          <div className="hidden md:flex items-center gap-6">
            {navItem("/dashboard", "Dashboard")}
            {navItem("/projects", "Projects")}
            {navItem("/tasks", "Tasks")}
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              {/* Name */}
              <span className="hidden sm:block text-sm text-gray-300">
                {user.name}
              </span>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-1.5 rounded-md text-sm transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-400 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-1.5 rounded-md text-sm transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}