import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-2xl hover:text-gray-100 transition">
            <span className="text-3xl">📊</span>
            <span>TeamTrackr</span>
          </Link>

          {user ? (
            <>
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-8">
                <div className="flex gap-6">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1 hover:text-gray-100 transition text-sm font-medium"
                  >
                    <span>📈</span> Dashboard
                  </Link>
                  <Link
                    to="/projects"
                    className="flex items-center gap-1 hover:text-gray-100 transition text-sm font-medium"
                  >
                    <span>📁</span> Projects
                  </Link>
                  <Link
                    to="/tasks"
                    className="flex items-center gap-1 hover:text-gray-100 transition text-sm font-medium"
                  >
                    <span>✅</span> Tasks
                  </Link>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 pl-6 border-l border-indigo-400">
                  <div className="w-8 h-8 bg-indigo-300 rounded-full flex items-center justify-center font-bold text-sm text-indigo-700">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user.name}</span>
                    <span className="text-xs text-indigo-200">{user.role}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm font-medium transition ml-3"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-2xl hover:text-gray-100 transition"
                >
                  {mobileMenuOpen ? "✕" : "☰"}
                </button>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="hover:text-gray-100 transition text-sm font-medium">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-sm font-medium transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && user && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded hover:bg-indigo-500 text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              📈 Dashboard
            </Link>
            <Link
              to="/projects"
              className="block px-3 py-2 rounded hover:bg-indigo-500 text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              📁 Projects
            </Link>
            <Link
              to="/tasks"
              className="block px-3 py-2 rounded hover:bg-indigo-500 text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              ✅ Tasks
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded bg-red-500 hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
