import React, { useState, useEffect ,useMemo} from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsService,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";
import axios from "axios";

const GOOGLE_MAP_API_KEY = import.meta.env.VITE_GOOGLE_MAP_API;

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Default location: India

// Define the libraries array outside the component to avoid re-creating it
const libraries = ["places"];

const MapComponent = ({ origin, destination }) => {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");

  const loaderOptions = {
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
    libraries
  };
  
    const { isLoaded,loadError } = useJsApiLoader(loaderOptions);

  // Utility function to fetch coordinates using backend API
  const fetchCoordinates = async (address, setCoords) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/map/get-coordinates`,
        {
          params: { address },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const location = response.data;
      if (location?.lat && location?.lng) {
        setCoords({ lat: location.lat, lng: location.lng });
      } else {
        console.error("No location found for address:", address);
        setCoords(null);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      setCoords(null);
    }
  };

  // Fetch coordinates when origin or destination changes
  useEffect(() => {
    setIsLoading(true);

    const fetchBothCoordinates = async () => {
      if (origin) await fetchCoordinates(origin, setOriginCoords);
      else setOriginCoords(null);

      if (destination) await fetchCoordinates(destination, setDestinationCoords);
      else setDestinationCoords(null);

      setIsLoading(false);
    };

    fetchBothCoordinates();
  }, [origin, destination]);

  // Callback for DirectionsService
  const handleDirectionsCallback = (response) => {
    if (response?.status === "OK") {
      setDirectionsResponse(response);
      const route = response.routes[0].legs[0];
      setDistance(route.distance.text); // Example: "15.6 km"
      setDuration(route.duration.text); // Example: "23 mins"
    } else {
      console.error("Directions request failed:", response?.status);
      setDirectionsResponse(null);
    }
  };

  // Determine map center dynamically
  const mapCenter = originCoords || destinationCoords || defaultCenter;

  if (loadError) {
    return <div className="text-red-500 text-center">Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div className="text-white text-center">Loading map...</div>;
  }

  return (
    <div className="relative">
      {/* Map Container */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={originCoords && destinationCoords ? 10 : 4}
      >
        {/* Markers */}
        {originCoords && <Marker position={originCoords} />}
        {destinationCoords && <Marker position={destinationCoords} />}
        {/* Directions Service */}
        {originCoords && destinationCoords && (
          <DirectionsService
            options={{
              origin: originCoords,
              destination: destinationCoords,
              travelMode: "DRIVING",
            }}
            callback={handleDirectionsCallback}
          />
        )}
        {/* Directions Renderer */}
        {directionsResponse && (
          <DirectionsRenderer
            options={{
              directions: directionsResponse,
            }}
          />
        )}
      </GoogleMap>

      {/* Display loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 text-white">
          Loading map data...
        </div>
      )}

      {/* Distance and Duration */}
      {!isLoading && distance && duration && (
        <div className="mt-4 text-center text-white">
          <p className="cursor-default">Distance: {distance}</p>
          <p className="cursor-default">Duration: {duration}</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
