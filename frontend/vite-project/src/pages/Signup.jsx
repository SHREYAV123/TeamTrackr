import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const { data } = await API.post("/user/signup", { name, email, password });
      localStorage.setItem("token", data.jwt);
      setUser(data.user);
      navigate("/projects");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-amber-50">
      <h2 className="text-3xl font-bold mb-4">Sign Up</h2>
      <input className="border p-2 mb-2 w-64" placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input className="border p-2 mb-2 w-64" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input className="border p-2 mb-2 w-64" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignup} className="bg-gray-800 text-white px-4 py-2 rounded">Sign Up</button>
      <p className="mt-2">
        Already have an account? <Link to="/login" className="underline">Login</Link>
      </p>
    </div>
  );
}
