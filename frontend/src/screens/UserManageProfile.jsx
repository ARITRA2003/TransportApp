import React, { useState, useContext } from "react";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import Sidebar from "../Components/UserSidebar";

const UserManageProfile = () => {
  const { user, setUser } = useContext(UserDataContext);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || { firstName: "", lastName: "" },
    email: user?.email || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [field, subField] = name.split(".");
    if (subField) {
      setFormData((prev) => ({
        ...prev,
        [field]: { ...prev[field], [subField]: value },
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/updateProfile`,
        { fullName: formData.fullName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setUser((prev) => ({
          ...prev,
          fullName: formData.fullName,
        }));
        alert("Profile updated successfully!");
        setIsEditing(false);
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
      fullName: user.fullName,
      email: user.email,
    });
    setIsEditing(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-gray-800 shadow-lg rounded-lg w-full max-w-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Manage Profile
          </h1>

          {isEditing ? (
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-400">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="fullName.firstName"
                    value={formData.fullName.firstName}
                    onChange={handleInputChange}
                    className="w-full mt-2 p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-400">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="fullName.lastName"
                    value={formData.fullName.lastName}
                    onChange={handleInputChange}
                    className="w-full mt-2 p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full mt-2 p-3 rounded-md bg-gray-700 text-gray-400 cursor-not-allowed"
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md text-white transition"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md text-white transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-4">
                <div>
                  <span className="block font-semibold text-gray-300">
                    First Name:
                  </span>
                  <span className="block text-lg">
                    {user?.fullName?.firstName || ""}
                  </span>
                </div>
                <div>
                <span className="block font-semibold text-gray-300">
                    Last Name:
                  </span>
                  <span className="block text-lg">
                  {user?.fullName?.lastName || ""}
                  </span>
                </div>
              </div>
              <div>
                <span className="block font-semibold text-gray-300">
                  Email:
                </span>
                <span className="block text-lg">{user?.email || "N/A"}</span>
              </div>
              <div className="text-center mt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-2 rounded-md text-white transition"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManageProfile;
