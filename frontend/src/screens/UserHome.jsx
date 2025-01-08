import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../Components/UserSidebar";
import MapComponent from "../Components/MapComponent";
import LiveSearchPanel from "../Components/LiveSearchPanel";
import ShowFares from "../Components/ShowFares";
import { UserDataContext } from "../context/UserContext";
import { SocketContext } from "../context/socketContext";

const UserHome = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState(0);
  const [goodsDescription, setGoodsDescription] = useState("");


  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  useEffect(() => {
      socket.emit("join", { userType: "user", userId: user._id })
  }, [ user ])

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Create a Ride</h1>

        {/* Weight and Goods Description Inputs */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Enter weight in kilograms"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Goods Description
            </label>
            <input
              type="text"
              value={goodsDescription}
              onChange={(e) => setGoodsDescription(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Enter a brief description of goods"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <LiveSearchPanel
              label="Origin"
              setLocation={setOrigin}
            />
            <LiveSearchPanel
              label="Destination"
              setLocation={setDestination}
            />
        </div>

        {/* Map Section */}
        <MapComponent origin={origin} destination={destination} />

        {/* Show Fares Section */}
        <ShowFares
          origin={origin}
          destination={destination}
          goodsDescription={goodsDescription}
          weight={weight}
        />
      </div>
    </div>
  );
};

export default UserHome;
