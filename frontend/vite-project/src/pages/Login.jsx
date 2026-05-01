import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const { data } = await API.post("/user/signin", { email, password });
      login(data.user, data.jwt);
      navigate("/dashboard");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">

        {/* Title */}
        <h2 className="text-4xl font-bold text-white text-center mb-2">
          Welcome Back 👋
        </h2>

        <p className="text-center text-gray-300 mb-6">
          Login to continue
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2.5 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2.5 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg transform hover:-translate-y-0.5"
        >
          🔐 Sign In
        </button>

        <div className="mt-4 px-4 py-3 rounded-lg bg-slate-900/80 border border-slate-700 text-sm text-slate-200 text-center">
          Login with your existing role. Your role is set on signup and preserved automatically.
        </div>
        <p className="mt-4 text-sm text-gray-300 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}