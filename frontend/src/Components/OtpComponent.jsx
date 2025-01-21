import React, { useReducer, useCallback, useMemo, useState,useEffect } from "react";
import axios from "axios"


// Reducer for managing OTP state
const otpReducer = (state, action) => {
  switch (action.type) {
    case "SET_OTP":
      return state.map((digit, index) => (index === action.index ? action.value : digit));
    case "RESET_OTP":
      return Array(6).fill("");
    default:
      throw new Error("Invalid action type");
  }
};

const OtpComponent = ({ rideId,status ,onOtpSuccess}) => {
  const [otp, dispatch] = useReducer(otpReducer, Array(6).fill(""));
  const [newStatus,setNewStatus] = useState("");
  const [error, setError] = React.useState("");
  const token = localStorage.getItem('token');

  // Memoize the combined OTP
  const enteredOtp = useMemo(() => otp.join(""), [otp]);

  const updateNewStatus = (status) => {
    if (status === "Goods Collected") {
      setNewStatus("Goods Delivered");
    } else if (status === "En-route") {
      setNewStatus("Goods Collected");
    } else {
      setNewStatus(""); // Default case, if needed
    }
  };
  useEffect(() => {
    updateNewStatus(status); // Call this whenever the status changes
  }, [status]);

  const handleChange = useCallback((element, index) => {
    if (isNaN(element.value)) return;

    dispatch({ type: "SET_OTP", index, value: element.value });

    // Automatically focus the next input field
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  }, []);

  const handleKeyDown = useCallback((event, index) => {
    if (event.key === "Backspace" && !otp[index] && event.target.previousSibling) {
      event.target.previousSibling.focus();
    }
  }, [otp]);

  const handleSubmit = useCallback(async () => {
    if (enteredOtp.length < 6 || enteredOtp.includes(" ")) {
      setError("Please enter all 6 digits.");
      return;
    }
    setError("");  // Reset error
    console.log(newStatus);
    try {
      let response;
      const payload = { 
        rideId ,
        status:newStatus
      };

      if (status === "En-route") {
        payload.originOtp = enteredOtp;  // Send origin OTP
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/ride/goods-collected`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (status === "Goods Collected") {
        payload.destinationOtp = enteredOtp;  // Send destination OTP
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/ride/goods-delivered`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response.status === 200) {
        // Notify the parent component that OTP submission was successful
        onOtpSuccess(response.data.status);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("There was an error verifying the OTP. Please try again.");
    }
  }, [enteredOtp, status, onOtpSuccess]);


  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Please enter the OTP for <span className="font-semibold">{newStatus}</span>.
      </h2>

      <div className="flex justify-center space-x-2 mb-4">
        {otp.map((value, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            className="w-10 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={value}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default React.memo(OtpComponent);
