import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const DriverLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginPayload = { email, password };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/driver/login`,
        loginPayload
      );

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("token", data.token);
        setSuccess("Welcome Captain! Redirecting...");
        setError(null);
        setEmail("");
        setPassword("");
        navigate("/driver-home");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-700 p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-4xl font-bold mb-6 text-center text-yellow-400">
          Captain's Hub
        </h2>
        <p className="text-gray-300 text-center mb-4">
          Please Login to continue your journey as a Captain.
        </p>

        {error && (
          <div className="mb-4 text-red-700 bg-red-100 border border-red-300 rounded-md p-3 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-green-700 bg-green-100 border border-green-300 rounded-md p-3 text-sm">
            {success}
          </div>
        )}

        {/* Email Field */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your Captain ID"
            className="mt-1 p-3 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-600 text-gray-100"
          />
        </div>

        {/* Password Field */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            className="mt-1 p-3 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-600 text-gray-100"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Login as Captain
        </button>

        {/* Sign-up Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-300">
            Not a Captain yet?{" "}
            <Link
              to="/driver-signup"
              className="text-yellow-400 font-semibold hover:underline"
            >
              Join Now
            </Link>
            .
          </p>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-300">
            <Link
              to="/user-login"
              className="text-yellow-400 font-semibold hover:underline"
            >
              Login as User
            </Link>
            .
          </p>
        </div>
      </form>
    </div>
  );
};

export default DriverLogin;
