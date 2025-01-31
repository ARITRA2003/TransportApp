import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"

const Sidebar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = async () => {
    try {
      
      const response = await  axios.get(
        `${import.meta.env.VITE_API_URL}/driver/logout`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem('token');
        navigate('/');
      }

    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="w-1/4 bg-gray-700 p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-8 text-yellow-400">🚚 Goods TransPort</h2>
        <nav className="space-y-4">
          <button
            onClick={() => navigate("/driver-home")}
            className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-600 transition"
          >
             Current Ride
          </button>
          <button
            onClick={() => navigate("/driver-manage-profile")}
            className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-600 transition"
          >
            Manage Profile
          </button>
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="block w-full text-left py-2 px-4 rounded-lg bg-orange-500 hover:translate-y-[-5px] transition-transform duration-300 ease-in-out"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
