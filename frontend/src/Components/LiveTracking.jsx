import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

// Define the libraries array outside the component to avoid re-creating it
const libraries = ["places"];

const GOOGLE_MAP_API_KEY = import.meta.env.VITE_GOOGLE_MAP_API;

const LiveTracking = ({ driverLocation, origincoords, destinationcoords, status }) => {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const loaderOptions = {
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
    libraries
  };

  const { isLoaded } = useJsApiLoader(loaderOptions);

  useEffect(() => {
    if (!isLoaded || !driverLocation) return;

    const calculateRoute = async () => {
      const origin = driverLocation;
      const destination = status === "En-route" ? origincoords : destinationcoords;

      try {
        const directionsService = new window.google.maps.DirectionsService();
        const result = await directionsService.route({
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        });

        setDirectionsResponse(result);

        if (result.routes[0]) {
          const { distance, duration } = result.routes[0].legs[0];
          setDistance(distance.text);
          setDuration(duration.text);
        }
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    };

    calculateRoute();
  }, [isLoaded, driverLocation,origincoords,destinationcoords,status]);

  if (!isLoaded) return <div className="text-center mt-4">Loading...</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Route Details */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2">Route Details</h4>
        <p className="text-gray-700">Distance: <span className="font-medium">{distance}</span></p>
        <p className="text-gray-700">Estimated Duration: <span className="font-medium">{duration}</span></p>
      </div>

      {/* Map */}
      <div className="h-96">
        <GoogleMap
          key={`${driverLocation.lat}-${driverLocation.lng}-${status}`}  // Unique key based on driver location and status
          center={driverLocation || origincoords}
          zoom={14}
          mapContainerStyle={{ width: "100%", height: "100%" }}
        >
          {/* Driver Location Marker */}
          {driverLocation && (
            <Marker
              position={driverLocation}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            />
          )}

          {/* Origin Marker (if En-route status) */}
          {status === "En-route" && origincoords && (
            <Marker
              position={origincoords}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
              }}
            />
          )}

          {/* Destination Marker */}
          {destinationcoords && (
            <Marker
              position={destinationcoords}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              }}
            />
          )}

          {/* Render Route */}
          {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
        </GoogleMap>
      </div>
    </div>
  );
};

export default LiveTracking;
