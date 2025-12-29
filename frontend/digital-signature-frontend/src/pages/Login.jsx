import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await loginUser(form);
      console.log(res);

      if (res.access_token) {
        localStorage.setItem("token", res.token);
        navigate("/dashboard");
      } else {
        setMessage(res.message || "Login failed");
      }
    } catch (err) {
      setMessage("Invalid credentials or email not verified");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-[400px]">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Welcome Back 👋
        </h2>

        <p className="text-gray-500 text-center mb-6 text-sm">
          Sign in to access your dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
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
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              value={form.password}
              onChange={handleChange}
              className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full p-2.5 rounded-lg outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
