import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

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
  }, [isLoaded, driverLocation, origincoords, destinationcoords, status]);

  if (!isLoaded) return <div className="text-center mt-4 text-white">Loading map...</div>;

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-700">
      {/* Route Details */}
      <div className="mb-6 bg-gray-700 p-4 rounded-lg">
        <h4 className="text-lg font-semibold mb-3 text-gray-300">Route Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Distance</p>
            <p className="text-white font-medium">{distance}</p>
          </div>
          <div>
            <p className="text-gray-400">Estimated Duration</p>
            <p className="text-white font-medium">{duration}</p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-96 rounded-lg overflow-hidden border border-gray-700">
        <GoogleMap
          key={`${driverLocation.lat}-${driverLocation.lng}-${status}`}
          center={driverLocation || origincoords}
          zoom={14}
          mapContainerStyle={{ width: "100%", height: "100%" }}
        >
          {/* Driver Marker */}
          {driverLocation && (
            <Marker
              position={driverLocation}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            />
          )}

          {/* Origin Marker */}
          {status === "En-route" && origincoords && (
            <Marker
              position={origincoords}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
              }}
            />
          )}

          {/* Destination Marker */}
          {destinationcoords && (
            <Marker
              position={destinationcoords}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              }}
            />
          )}

          {/* Route Renderer */}
          {directionsResponse && (
            <DirectionsRenderer 
              directions={directionsResponse}
              options={{
                polylineOptions: {
                  strokeColor: "#3b82f6",
                  strokeWeight: 5,
                },
                markerOptions: {
                  visible: false
                }
              }}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default LiveTracking;