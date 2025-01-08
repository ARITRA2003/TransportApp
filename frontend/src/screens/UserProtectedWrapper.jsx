import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';

const UserWrapper = ({ children }) => {
    const [loading,setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const {setUser} = React.useContext(UserDataContext);

    useEffect(() => {
        if (!token) {
            navigate('/user-login'); // Navigate to the login page if the token doesn't exist
        }

        axios.get(`${import.meta.env.VITE_API_URL}/user/getProfile`,{
        headers:{
            Authorization:`bearer ${token}`
        }
    }).then((response)=>{
        if(response.status === 200) {
            setLoading(false);
            setUser(response.data);
        }
    }).catch((err)=>{
        console.log(err);
        localStorage.removeItem(token);
        navigate("/user-login");
    })

    }, [token]);

    if(loading) {
        return (
            <div>loading...</div>
        );
    }

    return <>{children}</>; // Render the children if the token exists
};

export default UserWrapper;