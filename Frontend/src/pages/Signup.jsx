import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { UserPlus, Loader2 } from "lucide-react";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("guest");
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (password !== confirmPassword) {
      setErrors(["Passwords do not match."]);
      return;
    }

    if (!acceptTerms) {
      setErrors(["You must accept the terms and conditions."]);
      return;
    }

    setLoading(true);

    const payload = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      userType,
      terms: "on" // Backend validation specifically checks for 'on' string value
    };

    const result = await signup(payload);
    setLoading(false);

    if (result.success) {
      navigate("/login");
    } else {
      setErrors(result.errors || ["Registration failed."]);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <UserPlus className="h-6 w-6 text-red-500" />
          <h1 className="text-2xl font-extrabold text-gray-950">Create Account</h1>
        </div>
        <p className="text-gray-500 text-sm mb-6">Join WanderNest today. It only takes a minute.</p>

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
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
                required
              />
            </div>
          </div>

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

          {/* User Type Toggle */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">I want to join as a:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType("guest")}
                className={`py-2.5 px-4 rounded-lg font-bold text-sm border transition-all duration-150 ${
                  userType === "guest"
                    ? "bg-red-50 border-red-300 text-red-500"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Guest (to Rent)
              </button>
              <button
                type="button"
                onClick={() => setUserType("host")}
                className={`py-2.5 px-4 rounded-lg font-bold text-sm border transition-all duration-150 ${
                  userType === "host"
                    ? "bg-red-50 border-red-300 text-red-500"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Host (to List)
              </button>
            </div>
          </div>

          {/* Passwords */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 chars (1 uppercase, 1 special)"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
              required
            />
          </div>

          {/* Accept Terms */}
          <div className="flex items-start gap-2.5 py-2">
            <input
              id="accept-terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
              required
            />
            <label htmlFor="accept-terms" className="text-xs font-semibold text-gray-600 leading-normal">
              I agree to the WanderNest Terms of Service and Privacy Policy.
            </label>
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
                <span>Registering...</span>
              </>
            ) : (
              <span>Register</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm font-medium text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-red-500 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
