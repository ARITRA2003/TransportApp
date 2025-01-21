import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import LiveTracking from "./LiveTracking";

const UserRideModal = ({ ride, isOpen, onClose }) => {
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: "-100%" },
        { opacity: 1, y: "0%", duration: 0.5, ease: "power3.out" }
      );
    } else {
      gsap.to(modalRef.current, {
        opacity: 0,
        y: "-100%",
        duration: 0.5,
        ease: "power3.in",
        onComplete: onClose,
      });
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-gray-800 text-white p-8 rounded-lg shadow-xl w-11/12 md:w-2/3 lg:w-1/2"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 rounded-full p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Ride Details</h2>

        {/* Ride Info */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <p>
              <strong>Origin:</strong> {ride.origin.address}
            </p>
            <p>
              <strong>Destination:</strong> {ride.destination.address}
            </p>
          </div>
          <div className="flex justify-between">
            <p>
              <strong>Goods Description:</strong> {ride.goodsDescription}
            </p>
            <p>
              <strong>Weight:</strong> {ride.weight} kg
            </p>
          </div>
          <div className="flex justify-between">
            <p>
              <strong>Status:</strong> <span className="font-semibold">{ride.status}</span>
            </p>
            <p>
              <strong>Price:</strong> ₹{ride.price}
            </p>
          </div>

          {/* OTP */}
          <div className="flex justify-between">
            <p>
              <strong>Origin OTP:</strong> {ride.originOtp}
            </p>
            <p>
              <strong>Destination OTP:</strong> {ride.destinationOtp}
            </p>
          </div>
        </div>

        {/* Driver Info */}
        {ride.driver && (
          <div className="mt-6 p-4 border-t border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Driver Details</h3>
            <div className="space-y-3">
              <p>
                <strong>Name:</strong> {ride.driver.fullName.firstName} {ride.driver.fullName.lastName}
              </p>
              <p>
                <strong>Vehicle:</strong> {ride.driver.vehicle.vehicleType} (
                {ride.driver.vehicle.color}, Plate: {ride.driver.vehicle.plate})
              </p>
              {/* <p>{ride.driver.location.lat}{ride.driver.location.lng}</p> */}
            </div>
          </div>
        )}

        {/* Live Tracking Section */}
        <LiveTracking
          status={ride.status}
          driverLocation={ride.driver.location}
          origincoords={ride.origin.coordinates}
          destinationcoords={ride.destination.coordinates}
        />
      </div>
    </div>
  );
};

export default UserRideModal;
