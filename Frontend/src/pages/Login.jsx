import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { LogIn, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      // Check auth status context updates immediately and redirect
      // Wait a tiny bit to ensure context values propagate
      setTimeout(() => {
        navigate("/");
      }, 50);
    } else {
      setErrors(result.errors || ["Login failed."]);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <LogIn className="h-6 w-6 text-red-500" />
          <h1 className="text-2xl font-extrabold text-gray-950">Log In</h1>
        </div>
        <p className="text-gray-500 text-sm mb-6">Welcome back to WanderNest. Log in to continue.</p>

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm">
            <ul className="list-disc pl-4 space-y-1 font-medium">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Logging In...</span>
              </>
            ) : (
              <span>Log In</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm font-medium text-gray-500">
          New to WanderNest?{" "}
          <Link to="/signup" className="text-red-500 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
