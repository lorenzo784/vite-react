import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { toast } from 'react-toastify';
import AxiosInstance from "../utils/AxiosInstance";

const Profile = () => {
    const jwt = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))
    const navigate = useNavigate();

    useEffect(() => {
        if (jwt === null && !user) {
            navigate('/login')
        } else {
            getSomeData()
        }

    }, [jwt, user])

    let accessToken = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : ""

    const getSomeData = async () => {
        try {
            const res = await axios.get('http://localhost:8000/auth/get-something/', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log(res)
            toast.success(res.data.msg)
        } catch (error) {
            toast.warn('Error al realizar la solicitud');
        }
    };

    let refresh = localStorage.getItem('refresh_token') ? JSON.parse(localStorage.getItem('refresh_token')) : ""

    const handleLogout = async () => {
        const res = await axios.post(
            'http://localhost:8000/auth/logout/', 
            { "refresh_token": refresh },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        if (res.status === 204) {
            localStorage.removeItem('token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('user')
            navigate('/login')
            toast.warn("logout successful")
        }
    }

    return (
        <div className='container'>
            <h2>hi {user && user.full_name}</h2>
            <p style={{ textAlign: 'center', }}>Welcome to your profile</p>
            <button onClick={handleLogout} className='logout-btn'>Logout</button>
        </div>
    )
}

export default Profile