import React, { useState } from "react";
import axios from "axios";

const LiveSearchPanel = ({ label, setLocation }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const token = localStorage.getItem("token");

  const handleInputChange = async (input) => {
    setInputValue(input);

    if (input.trim().length > 2) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/map/get-suggestions`,
          {
            params: { input },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSuggestions(response.data.predictions || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.description);
    setSuggestions([]);
    setLocation(suggestion.description);
  };

  return (
    <div className="relative w-full mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={`Enter ${label}`}
        className="w-full p-3 rounded bg-gray-700 text-white"
      />
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full bg-gray-800 text-white rounded shadow-md max-h-48 overflow-y-auto z-10">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-2 hover:bg-gray-600 cursor-pointer"
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LiveSearchPanel;
