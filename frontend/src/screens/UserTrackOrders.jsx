import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../Components/UserSidebar";
import axios from "axios";
import { SocketContext } from "../context/socketContext";

const UserTrackOrders = () => {
  const [rides, setRides] = useState([]);
  const token = localStorage.getItem("token");
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/ride/user-rides`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRides(response.data);
        // console.log(rides);
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };

    fetchRides();
  }, []);

  // socket.on('confirmed-ride',(data)=>{
  //   console.log(data);
  // })

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Your Rides</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rides.length > 0 ? (
            rides.map((ride) => (
              <div key={ride._id}>
                <p>Origin: {ride.origin}</p>
                <p>Destination: {ride.destination}</p>
                <p>Status: {ride.status}</p>
              </div>
            )
            )
          ) : (
            <div className="col-span-full text-center">
              <p>No rides available. Book a ride to see details here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTrackOrders;
