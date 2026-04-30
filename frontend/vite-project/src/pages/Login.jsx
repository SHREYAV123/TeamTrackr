import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const { data } = await API.post("/user/signin", { email, password });
      localStorage.setItem("token", data.jwt);
      setUser(data.user);
      navigate("/projects");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-amber-50">
      <h2 className="text-3xl font-bold mb-4">Login</h2>
      <input
        className="border p-2 mb-2 w-64"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 mb-2 w-64"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-gray-800 text-white px-4 py-2 rounded"
      >
        Sign In
      </button>
      <p className="mt-2">
        Don’t have an account? <Link to="/signup" className="underline">Sign up</Link>
      </p>
    </div>
  );
}
