import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ShowFares = ({ weight, goodsDescription, origin, destination }) => {
    const [fares, setFares] = useState({});
    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchFares = async () => {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/fare/calculate-fares`,
                    {
                        weight,
                        origin,
                        destination,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setFares(response.data || {});
                console.log(fares);
            } catch (error) {
                console.error("Error fetching fares:", error);
            }
        };

        if (weight && origin && destination) {
            fetchFares();
        }
    }, [weight, origin, destination]);

    // Return nothing if any required field is missing
    if (!weight || !origin || !destination) {
        return null;
    }

    const handleClick = async (vehicleType) => {
        try{
            // console.log(vehicleType);
            const payload = {
                vehicleType,
                weight,
                origin,
                destination,
                goodsDescription
            };
            // console.log(payload);
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/ride/create-ride`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if(response.status == 201) {
                navigate("/user-track-orders");
            }
        }
        catch(e){
            alert("All feilds must be given");
            console.log(e);
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {Object.keys(fares).length > 0 ? (
                Object.entries(fares).map(([vehicleType, fare], index) => (
                    <div
                        key={index}
                        className="bg-gradient-to-br from-orange-500 to-yellow-500 text-white rounded-lg shadow-lg p-4 flex flex-col justify-between hover:translate-y-[-5px] cursor-pointer transition-transform duration-300 ease-in-out"
                        onClick={() => handleClick(vehicleType)}
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold">{vehicleType}</h3>
                            <p className="font-semibold">₹{fare}</p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-white text-center col-span-full w-full">
                    No fares available. Please ensure all inputs are correct.
                </div>
            )}
        </div>
    );
};

export default ShowFares;
