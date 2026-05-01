import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Member");

  const handleSignup = async () => {
    try {
      const { data } = await API.post("/user/signup", {
        name,
        email,
        password,
        role,
      });
      login(data.user, data.jwt);
      navigate("/dashboard");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-gray-800">
            Create Account
          </h2>
          <p className="text-gray-500 mt-2 text-base">
            Start managing your projects 🚀
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-base"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-base"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-base"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-base"
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Admin users can manage projects.
            </p>
          </div>

        </div>

        {/* Button */}
        <button
          onClick={handleSignup}
          className="mt-6 w-full bg-indigo-600 text-white text-lg font-bold py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          🚀 Create Account
        </button>

        {/* Info Box */}
        <div className="mt-4 p-3 rounded-lg bg-indigo-50 text-indigo-700 text-sm text-center">
          Select your role carefully. Admins have extra permissions.
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-300 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}