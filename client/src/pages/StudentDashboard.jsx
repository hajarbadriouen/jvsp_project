import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

import './StudentDashboard.css'; // Import your CSS file for styling






const StudentDashboard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found. Please log in.');
            setLoading(false);
            return; // Don't continue if no token is found
        } 

        fetch("http://localhost:3001/student", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to fetch data.');
            }
            return res.json();
        })
        .then(data => {
            if (data.user) {
                setUserData(data.user);
            } else {
                setError('User not found.');
            }
        })
        .catch(err => {
            setError('Error fetching user data: ' + err.message);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <p>Loading22...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="dashboard-container1">
            <h2>Student Dashboard</h2>
            {userData ? (
                <div className="user-details1">
                    <h3>Welcome, {userData.name}</h3>
                    <p>Email: {userData.email}</p>
                    <p>Role: {userData.role}</p>
                </div>
            ) : (
                <p>No student data available.</p>
            )}
        </div>
    );
};

export default StudentDashboard;
