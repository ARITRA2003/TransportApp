import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {createPortal} from 'react-dom'
import axios from "axios";
import gsap from 'gsap';
import { SocketContext } from "../context/socketContext";
import { DriverDataContext } from "../context/DriverContext";
import Sidebar from "../Components/DriverSidebar";
import RideProgressBar from "../Components/RideProgressBar";
import DriverRideDetails from "../Components/DriverRideDetails";
import LiveTracking from "../Components/LiveTracking";
import OtpComponent from "../Components/OtpComponent";
import MapComponent from "../Components/MapComponent"

const DriverHome = () => {
  const { socket } = useContext(SocketContext);
  const { driver } = useContext(DriverDataContext);
  const [ride, setRide] = useState(null);
  const [currentRideStatus, setCurrentRideStatus] = useState("");
  const [driverLocation, setDriverLocation] = useState({});
  const [otpComponentVisible,setOtpComponentVisible] = useState(false); 
  const token = localStorage.getItem("token");
  const popupRef = useRef();

  useEffect(() => {
    // Emit event to join the driver's room
    socket.emit("join", { userType: "driver", userId: driver._id });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            // console.log(ride);
            // console.log({
            //   userId: ride?.user._id || null,
            //   driverId:driver._id,
            //   rideId:ride?._id || null,
            //   location
            // });
            socket.emit("update-location-driver", {
              userId: ride?.user._id || null,
              driverId:driver._id,
              rideId:ride?._id || null,
              location
            });
            setDriverLocation(location);
          },
          (error) => {
            console.error("Error fetching location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    const locationInterval = setInterval(updateLocation, 5000);

    // Listen for new ride event
    socket.on("new-ride", (data) => {
      setRide(data); // Store the ride details
      setCurrentRideStatus(data.status);
    });

    // Clean up
    return () => {
      clearInterval(locationInterval);
    };
  }, [driver, socket,ride]);

  useEffect(() => {
    const fetchCurrentRide = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/ride/driver-current-ride`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response);
        const data = response?.data;
        // console.log(data);
        if (data.length > 0) {
          setRide(data[0]);
          setCurrentRideStatus(data[0].status);
        }
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };

    if (token) {
      fetchCurrentRide();
    } else {
      console.warn("No token found. Skipping ride fetch.");
    }
  }, [token]);

  const handleOtpSuccess = (newStatus) => {
    handlePopupClose();
    setCurrentRideStatus(newStatus); 
  };

  const handlePopupOpen = () => {
    setOtpComponentVisible(true);

    // GSAP animation for popup entry
    gsap.fromTo(
      popupRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }
    );
  };

  const handlePopupClose = () => {
    // GSAP animation for popup exit
    gsap.to(popupRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power3.in",
      onComplete: () => setOtpComponentVisible(false),
    });
  };


  const otpPortal = useMemo(() => {
    if (!otpComponentVisible) return null;

    return createPortal(
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div
          ref={popupRef}
          className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
        >
          
          <OtpComponent
            rideId={ride._id}
            status={currentRideStatus}
            onOtpSuccess={handleOtpSuccess}
          />
          <button
            onClick={handlePopupClose}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>,
      document.body
    );
  }, [otpComponentVisible, currentRideStatus]);

  const handleStartRide = async(newStatus) =>{
     
     try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/ride/start-ride`,
          {
            rideId: ride._id,
            status:newStatus
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.status === 200) {
          setCurrentRideStatus(newStatus);
          alert("Ride status updated successfully!");
        }
      } catch (error) {
        console.error("Error updating ride status:", error);
        alert("Failed to start the ride. Please try again.");
      }
  }

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
      }
    } catch (error) {
      console.error("Error accepting ride:", error);
      alert("Failed to accept ride. Please try again.");
    }
  };

  const handleRejectRide = async() => {
    setRide(null);
    setCurrentRideStatus("");
  };

  

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 p-8">

        {!ride && (
          <div>
            No current rides
          </div>
        )}

        {ride && currentRideStatus === "Waiting For Driver" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white text-black rounded-lg p-6 shadow-lg max-w-lg w-full">
              <h3 className="text-xl font-bold mb-4">New Ride Request</h3>
              <p><strong>Origin:</strong> {ride.origin.address}</p>
              <p><strong>Destination:</strong> {ride.destination.address}</p>
              <p><strong>Distance:</strong> {(ride.distance / 1000).toFixed(2)} km</p>
              <p><strong>Estimated Time:</strong> {(ride.estimatedTime / 60).toFixed(2)} minutes</p>
              <p><strong>Weight:</strong> {ride.weight} kg</p>
              <p><strong>Goods Description:</strong> {ride.goodsDescription}</p>
              <p><strong>Price:</strong> ₹{ride.price}</p>
              <p>
                <strong>By:</strong>{" "}
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

        {ride && currentRideStatus === "Accepted" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <DriverRideDetails ride={ride} />
            <RideProgressBar status={currentRideStatus} />
            {/* <MapComponent origin={ride.origin.address} destination={ride.destination.address} /> */}
            <button className="mt-4 px-6 py-3 text-white font-bold bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition duration-200 focus:ring-4 focus:ring-blue-300 focus:outline-none"
              onClick={() => { handleStartRide("En-route") }}>
              Start the Ride
            </button>
          </div>
        )}

        {ride && currentRideStatus === "En-route" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <DriverRideDetails ride={ride} />
            <RideProgressBar status={currentRideStatus} />
            <LiveTracking
              driverLocation={driverLocation}
              origincoords={ride.origin.coordinates}
              destinationcoords={ride.destination.coordinates}
              status={currentRideStatus}
            />
            <button
              className="mt-4 px-6 py-3 text-white font-bold bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition duration-200 focus:ring-4 focus:ring-blue-300 focus:outline-none"
              onClick={handlePopupOpen}
            >
              Mark as Goods Collected
            </button>
            {otpPortal}
          </div>
        )}

        {ride && currentRideStatus === "Goods Collected" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <DriverRideDetails ride={ride} />
            <RideProgressBar status={currentRideStatus} />
            <LiveTracking
              driverLocation={driverLocation}
              origincoords={ride.origin.coordinates}
              destinationcoords={ride.destination.coordinates}
              status={currentRideStatus}
            />
            <button
              className="mt-4 px-6 py-3 text-white font-bold bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition duration-200 focus:ring-4 focus:ring-blue-300 focus:outline-none"
              onClick={handlePopupOpen}
            >
              Mark as Goods Delivered
            </button>
            {otpPortal}
          </div>
        )}

        {ride && currentRideStatus === "Goods Delivered" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <DriverRideDetails ride={ride} />
            <RideProgressBar status={currentRideStatus} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverHome;
