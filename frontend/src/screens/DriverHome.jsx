import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/DriverSidebar";
import { SocketContext } from "../context/socketContext";
import { DriverDataContext } from "../context/DriverContext";
import axios from "axios";

const DriverHome = () => {
  const { socket } = useContext(SocketContext);
  const { driver } = useContext(DriverDataContext);
  const [ride, setRide] = useState(null); // For storing the current ride details
  const [currentRideStatus, setCurrentRideStatus] = useState(null); // To manage ride status
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Emit event to join the driver's room
    socket.emit("join", { userType: "driver", userId: driver._id });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            socket.emit("update-location-driver", {
              userId: driver._id,
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            });
          },
          (error) => {
            console.error("Error fetching location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    const locationInterval = setInterval(updateLocation, 1000);

    // Listen for new ride event
    socket.on("new-ride", (data) => {
      setRide(data); // Store the ride details
    });

    // Clean up
    return () => {
      clearInterval(locationInterval);
      // socket.off("new-ride");
    };
  }, [driver, socket]);

  const handleAcceptRide = async () => {
    if (!ride?._id) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ride/confirm-ride`,
        {
          rideId: ride._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Ride accepted successfully!");
        setCurrentRideStatus("Accepted");
        setRide(null); // Clear the popup after accepting
      }
    } catch (error) {
      console.error("Error accepting ride:", error);
      alert("Failed to accept ride. Please try again.");
    }
  };

  const handleRejectRide = () => {
    setRide(null); // Clear the popup if the driver rejects the ride
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Current Ride Status */}
        {currentRideStatus && (
          <div className="bg-green-500 text-white rounded-lg p-4 mb-4 shadow-lg">
            <p>Current Ride Status: {currentRideStatus}</p>
          </div>
        )}

        {/* Ride Pop-Up */}
        {ride && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white text-black rounded-lg p-6 shadow-lg max-w-lg w-full">
              <h3 className="text-xl font-bold mb-4">New Ride Request</h3>
              <p><strong>Origin:</strong> {ride.origin}</p>
              <p><strong>Destination:</strong> {ride.destination}</p>
              <p><strong>Distance:</strong> {(ride.distance / 1000).toFixed(2)} km</p>
              <p><strong>Estimated Time:</strong> {(ride.estimatedTime / 60).toFixed(2)} minutes</p>
              <p><strong>Weight:</strong> {ride.weight} kg</p>
              <p><strong>Goods Description:</strong> {ride.goodsDescription}</p>
              <p><strong>Price:</strong> ₹{ride.price}</p>
              <p>
                <strong>Requested By:</strong>{" "}
                {ride.user?.fullName?.firstName} {ride.user?.fullName?.lastName}
              </p>

              <div className="mt-4 flex justify-between">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={handleAcceptRide}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={handleRejectRide}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverHome;
