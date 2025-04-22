import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const userEmail = sessionStorage.getItem("userEmail") || '';
    const userId = sessionStorage.getItem("userId") || '';
    const userName = sessionStorage.getItem("userName") || '';

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    }
    return (
        <>
            welcome to dashboard brother!!!
            <p><strong>Email:</strong> {userEmail}</p>
            <p><strong>User ID:</strong> {userId}</p>
            <p><strong>Username:</strong> {userName}</p>
            <button onClick={handleLogout}>Logout</button>
        </>
    )
}

export default Dashboard;