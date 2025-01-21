import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../Components/UserSidebar";
import axios from "axios";
import { SocketContext } from "../context/socketContext";
import UserRideModal from "../Components/UserRideModal";

const UserTrackOrders = () => {
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
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
        console.log(response.data);
        setRides(response.data);
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };

    fetchRides();
  }, []);

  useEffect(() => {
    // Check if socket is available
    if (!socket) return;

    console.log("Socket connected:", socket.connected);

    // Event listeners for socket updates
    const handleConfirmedRideUpdate = (data) => {
      console.log(data);
      setRides((prevRides) =>
        prevRides.map((ride) => (ride._id === data._id ? data : ride))
      );

      if (selectedRide && selectedRide._id === data._id) {
        setSelectedRide(data);
      }
    };

    const handleRideStatusUpdate = (data) => {
      setRides((prevRides) =>
        prevRides.map((ride) =>
          ride._id === data._id ? { ...ride, status: data.status } : ride
        )
      );

      if (selectedRide && selectedRide._id === data._id) {
        setSelectedRide((prevSelectedRide) => ({
          ...prevSelectedRide,
          status: data.status,
        }));
      }
    };

    const handleRideDriverLocationUpdate = (data) => {
      const { location, _id } = data;
      console.log(location);
      setRides((prevRides) =>
        prevRides.map((ride) =>
          ride._id === _id
            ? { ...ride, driver: { ...ride.driver, location } }
            : ride
        )
      );

      if (selectedRide && selectedRide._id === _id) {
        setSelectedRide((prevSelectedRide) => ({
          ...prevSelectedRide,
          driver: { ...prevSelectedRide.driver, location },
        }));
      }
    };

    // Attach socket event listeners
    socket.on("confirmed-ride", handleConfirmedRideUpdate);
    socket.on("ride-status-updated", handleRideStatusUpdate);
    socket.on("driver-location-update", handleRideDriverLocationUpdate);

    // Cleanup listeners on unmount
    // return () => {
    //   socket.off("confirmed-ride", handleConfirmedRideUpdate);
    //   socket.off("ride-status-updated", handleRideStatusUpdate);
    //   socket.off("driver-location-update", handleRideDriverLocationUpdate);
    // };
  }, [socket, selectedRide,rides]);

  const openModal = (ride) => {
    setSelectedRide(ride);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Your Rides</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rides.length > 0 ? (
            rides.map((ride) => (
              <div
                key={ride._id}
                className="bg-gray-700 p-4 rounded shadow-lg space-y-2 cursor-pointer"
                onClick={() => openModal(ride)}
              >
                <p>
                  <strong>Origin:</strong> {ride.origin.address}
                </p>
                <p>
                  <strong>Destination:</strong> {ride.destination.address}
                </p>
                <p>
                  <strong>Status:</strong> {ride.status}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center">
              <p>No rides available. Book a ride to see details here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedRide && (
        <UserRideModal
          ride={selectedRide}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default UserTrackOrders;
