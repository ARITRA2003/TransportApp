import React, { useState, useContext } from "react";
import axios from "axios";
import { DriverDataContext } from "../context/DriverContext";
import Sidebar from "../Components/DriverSidebar";

const DriverManageProfile = () => {
  const { driver, setDriver } = useContext(DriverDataContext); // Context for driver data
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: { ...driver?.fullName },
    email: driver?.email || "",
    phone: driver?.phone || "",
    vehicle: { ...driver?.vehicle },
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [field, subField] = name.split(".");
    if (subField) {
      setFormData((prev) => ({
        ...prev,
        [field]: { ...prev[field], [subField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/driver/updateProfile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setDriver(formData); // Update context with new data
        alert("Profile updated successfully!");
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: { ...driver?.fullName },
      email: driver?.email || "",
      phone: driver?.phone || "",
      vehicle: { ...driver?.vehicle },
    });
    setEditMode(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">Driver Profile</h2>
        {!editMode ? (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Personal Details</h3>
              <div className="mb-4">
                <label className="font-semibold">Full Name: </label>
                {`${driver?.fullName?.firstName || ""} ${driver?.fullName?.lastName || ""}`}
              </div>
              <div className="mb-4">
                <label className="font-semibold">Email: </label>
                {driver?.email}
              </div>
              <div className="mb-4">
                <label className="font-semibold">Phone: </label>
                {driver?.phone || "N/A"}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Vehicle Details</h3>
              <div className="mb-4">
                <label className="font-semibold">Vehicle Type: </label>
                {driver?.vehicle?.vehicleType || "N/A"}
              </div>
              <div className="mb-4">
                <label className="font-semibold">Color: </label>
                {driver?.vehicle?.color || "N/A"}
              </div>
              <div className="mb-4">
                <label className="font-semibold">Plate: </label>
                {driver?.vehicle?.plate || "N/A"}
              </div>
              <div className="mb-4">
                <label className="font-semibold">Capacity: </label>
                {driver?.vehicle?.capacity || "N/A"}
              </div>
            </div>

            <div>
              <button
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Personal Details</h3>
              <div className="flex space-x-6">
                <div className="flex-1">
                  <label className="block mb-2 font-semibold">First Name</label>
                  <input
                    type="text"
                    name="fullName.firstName"
                    value={formData.fullName.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-700 text-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-2 font-semibold">Last Name</label>
                  <input
                    type="text"
                    name="fullName.lastName"
                    value={formData.fullName.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-700 text-white"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block mb-2 font-semibold">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-700 text-white"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Vehicle Details</h3>
              <div className="mb-4">
                <label className="block mb-2 font-semibold">Vehicle Type</label>
                <input
                  type="text"
                  name="vehicle.vehicleType"
                  value={formData.vehicle.vehicleType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-700 text-white"
                />
              </div>
              <div className="flex space-x-6">
                <div className="flex-1">
                  <label className="block mb-2 font-semibold">Color</label>
                  <input
                    type="text"
                    name="vehicle.color"
                    value={formData.vehicle.color}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-700 text-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-2 font-semibold">Plate</label>
                  <input
                    type="text"
                    name="vehicle.plate"
                    value={formData.vehicle.plate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-700 text-white"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block mb-2 font-semibold">Capacity</label>
                <input
                  type="number"
                  name="vehicle.capacity"
                  value={formData.vehicle.capacity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-700 text-white"
                />
              </div>
            </div>

            <div className="flex space-x-6">
              <button
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverManageProfile;
