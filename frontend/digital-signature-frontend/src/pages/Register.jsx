import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await registerUser(form);
      setMessage(res.message || "Registration complete. Check your email!");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setMessage("Registration failed. Try again!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-[400px]">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Create Account ✨
        </h2>

        <p className="text-gray-500 text-center mb-6 text-sm">
          Join us and start signing your files securely
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              required
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full p-2.5 rounded-lg outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              value={form.email}
              onChange={handleChange}
              className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full p-2.5 rounded-lg outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              required
              value={form.password}
              onChange={handleChange}
              className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full p-2.5 rounded-lg outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Role</label>
            <select
              name="role"
              required
              value={form.role}
              onChange={handleChange}
              className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full p-2.5 rounded-lg outline-none transition bg-white"
            >
              <option value="">Select a role</option>
              <option value="Professor">Professor</option>
              <option value="Student">Student</option>
              <option value="Employee">Employee</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Register
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-green-600 animate-fade-in">
            {message}
          </p>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
