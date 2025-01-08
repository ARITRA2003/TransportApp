import React from "react";
import { useNavigate } from "react-router-dom";
import GoodsTransport from "../assets/GoodsTransPort.png"

const Start = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <div className="max-w-4xl text-center">
        <img
          src={GoodsTransport}
          alt="Goods Transport"
          className="w-full rounded-lg shadow-lg mb-8"
        />
        <h1 className="text-4xl font-bold mb-4 text-yellow-400">
          Welcome to Goods & Transport
        </h1>
        <p className="text-lg mb-8 text-gray-300">
          The one-stop solution for your goods transportation needs. Whether
          you're a user or a captain, join us and simplify your logistics today!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => navigate("/user-login")}
            className="bg-blue-600 py-3 px-6 rounded-lg text-xl font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            User Login
          </button>
          <button
            onClick={() => navigate("/user-signup")}
            className="bg-green-600 py-3 px-6 rounded-lg text-xl font-semibold hover:bg-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            User Sign Up
          </button>
          <button
            onClick={() => navigate("/driver-login")}
            className="bg-yellow-600 py-3 px-6 rounded-lg text-xl font-semibold hover:bg-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Captain Login
          </button>
          <button
            onClick={() => navigate("/driver-signup")}
            className="bg-purple-600 py-3 px-6 rounded-lg text-xl font-semibold hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Captain Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Start;
