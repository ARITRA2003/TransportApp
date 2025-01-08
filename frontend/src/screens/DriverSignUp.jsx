import React, { useState,useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { SocketContext } from "../context/socketContext";

const DriverSignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const {sendMessage,receiveMessage} = useContext(SocketContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    // Capacity validation
    if (capacity <= 0) {
      setError("Vehicle capacity must be a positive number.");
      return;
    }

    const requestData = {
      fullName: {
        firstName,
        lastName,
      },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        vehicleType,
        capacity,
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/driver/register`,
        requestData
      );

      if (response.status === 201) {
        const data = response.data;
        localStorage.setItem("token", data.token);

        setSuccess("Captain registration successful! Redirecting...");
        setError(null);

        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setVehicleColor("");
        setVehiclePlate("");
        setVehicleType("");
        setCapacity("");

        navigate("/driver-home");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-700 p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-4xl font-bold mb-6 text-center text-yellow-400">
          Become a Captain
        </h2>
        <p className="text-gray-300 text-center mb-4">
          Join our team and start your journey today!
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

        {/* Full Name Fields (Same Row) */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-300">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="First Name"
              className="mt-1 p-3 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-600 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Last Name"
              className="mt-1 p-3 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-600 text-gray-100"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
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
            placeholder="Create a password"
            className="mt-1 p-3 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-600 text-gray-100"
          />
        </div>

        {/* Vehicle Fields */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-300">Vehicle Color</label>
            <input
              type="text"
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
              required
              placeholder="Color"
              className="mt-1 p-3 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-600 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Vehicle Plate</label>
            <input
              type="text"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
              required
              placeholder="Plate Number"
              className="mt-1 p-3 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-600 text-gray-100"
            />
          </div>
        </div>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-300">Vehicle Type</label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            required
            className="mt-1 p-3 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-600 text-gray-100"
          >
            <option value="" disabled>Select Vehicle Type</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
            <option value="Mini Truck">Mini Truck</option>
            <option value="Container Truck">Container Truck</option>
            <option value="Trailer">Trailer</option>
            <option value="Three Wheeler">Three Wheeler</option>
          </select>
        </div>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-300">Vehicle Capacity (in kgs)</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
            placeholder="Enter capacity in kgs"
            className="mt-1 p-3 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-600 text-gray-100"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Become a Captain
        </button>

        {/* Already Registered Links */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-300">
            Already a Captain?{" "}
            <Link
              to="/driver-login"
              className="text-yellow-400 font-semibold hover:underline"
            >
              Log in here
            </Link>
            .
          </p>
          <p className="text-sm text-gray-300 mt-2">
            <Link
              to="/user-login"
              className="text-yellow-400 font-semibold hover:underline"
            >
              Login as User
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default DriverSignUp;
