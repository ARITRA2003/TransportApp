import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import LiveTracking from "./LiveTracking";

const UserRideModal = ({ ride, isOpen, onClose }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: "-100%" },
        { opacity: 1, y: "0%", duration: 0.5, ease: "power3.out" }
      );
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const statusStyles = {
    "Waiting For Driver": "bg-yellow-500",
    "En-Route": "bg-blue-500",
    "Goods Collected": "bg-green-500",
    "Goods Delivered": "bg-purple-500",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-gray-800 text-white p-6 rounded-xl shadow-2xl w-11/12 md:w-2/3 lg:w-1/2 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Ride Details</h2>
          <div className={`${statusStyles[ride.status]} inline-block px-4 py-1 rounded-full text-sm`}>
            {ride.status}
          </div>
        </div>

        <div className="space-y-6">
          {/* Location Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-blue-400">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Pickup Location</h3>
              </div>
              <p className="text-gray-300">{ride.origin.address}</p>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-green-400">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="font-semibold">Delivery Location</h3>
              </div>
              <p className="text-gray-300">{ride.destination.address}</p>
            </div>
          </div>

          {/* Goods & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-gray-400">Goods Details</h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-300">Description:</span>
                  <span className="font-medium">{ride.goodsDescription}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-300">Weight:</span>
                  <span className="font-medium">{ride.weight} kg</span>
                </p>
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-gray-400">Payment Details</h3>
              <div className="text-2xl font-bold text-center pt-2">
                ₹{ride.price}
              </div>
            </div>
          </div>

          {/* Security OTP Section */}
          {(ride.status === "En-route" || ride.status === "Goods Collected") && (
            <div className="bg-gray-700 p-4 rounded-lg border-2 border-dashed border-yellow-500">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="font-semibold">Security OTP</h3>
              </div>
              {ride.status === "En-route" && (
                <div className="space-y-2">
                  <div className="font-mono text-xl bg-gray-800 p-3 rounded-lg">
                    {ride.originOtp}
                  </div>
                </div>
              )}
              {ride.status === "Goods Collected" && (
                <div className="space-y-2">

                  <div className="font-mono text-xl bg-gray-800 p-3 rounded-lg">
                    {ride.destinationOtp}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Driver Info */}
          {ride.driver && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-4 text-gray-400">Driver Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="font-medium">{ride.driver.fullName.firstName} {ride.driver.fullName.lastName}</p>
                  <p className="text-sm text-gray-300">Licensed Driver</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">{ride.driver.vehicle.vehicleType}</p>
                  <p className="text-sm text-gray-300">
                    {ride.driver.vehicle.color} • {ride.driver.vehicle.plate}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Tracking */}
        <div className="mt-6">
          <LiveTracking
            status={ride.status}
            driverLocation={ride.driver?.location}
            origincoords={ride.origin.coordinates}
            destinationcoords={ride.destination.coordinates}
          />
        </div>
      </div>
    </div>
  );
};

export default UserRideModal;