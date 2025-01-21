import React from 'react'

const DriverRideDetails = ({ride}) => {
    return (
        <div className="bg-white text-black rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Ride Details</h2>
            <div className="space-y-2 text-gray-700">
                <p>
                    <strong>Origin:</strong> {ride.origin.address}
                </p>
                <p>
                    <strong>Destination:</strong> {ride.destination.address}
                </p>
                <p>
                    <strong>Distance:</strong> {(ride.distance / 1000).toFixed(2)} km
                </p>
                <p>
                    <strong>Estimated Time:</strong>{" "}
                    {(ride.estimatedTime / 60).toFixed(2)} minutes
                </p>
                <p>
                    <strong>Weight:</strong> {ride.weight} kg
                </p>
                <p>
                    <strong>Goods Description:</strong> {ride.goodsDescription}
                </p>
                <p>
                    <strong>Price:</strong> ₹{ride.price}
                </p>
            </div>
        </div>
    )
}

export default DriverRideDetails
