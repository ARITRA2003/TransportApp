import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DriverDataContext } from '../context/DriverContext';

const DriverWrapper = ({ children }) => {
    const [loading,setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const {driver,setDriver} = React.useContext(DriverDataContext);

    useEffect(() => {
        if (!token) {
            navigate('/driver-login'); // Navigate to the login page if the token doesn't exist
        }
        axios.get(`${import.meta.env.VITE_API_URL}/driver/getProfile`,{
            headers:{
                Authorization:`bearer ${token}`
            }
        }).then((response)=>{
            if(response.status === 200) {
                setLoading(false);
                setDriver(response.data);
            }
        }).catch((err)=>{
            console.log(err);
            localStorage.removeItem(token);
            navigate("/driver-login");
        })
    }, [token]);

    if(loading) {
        return (
            <div>loading...</div>
        );
    }

    return <>{children}</>; // Render the children if the token exists
};

export default DriverWrapper;