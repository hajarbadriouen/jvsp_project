// src/pages/TeacherDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';  // Redirect if no token
        } else {
            fetch("http://localhost:3001/teacher", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUserData(data.user);
                }
            })
            .catch(err => {
                console.error(err);
            });
        }
    }, []);

    return (
        <div className="dashboard-container">
            <h2>Teacher Dashboard</h2>
            {userData ? (
                <div className="user-details">
                    <h3>Welcome, {userData.name}</h3>
                    <p>Email: {userData.email}</p>
                    <p>Role: {userData.role}</p>
                </div>
            ) : (
                <p>No teacher data available.</p>
            )}
        </div>
    );
};

export default TeacherDashboard;
