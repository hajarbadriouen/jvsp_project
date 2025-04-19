// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from 'react';

const StudentDashboard = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';  // Redirect if no token
        } else {
            fetch("http://localhost:3001/student", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then(res => {
                console.log("Fetch response status:", res.status); // 🪵 log 2
                return res.json();
            })
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
        <div>
            <h2>Student Dashboard</h2>
            {userData ? (
                <div>
                    <h3>Welcome, {userData.name}</h3>
                    <p>Email: {userData.email}</p>
                    <p>Role: {userData.role}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default StudentDashboard;
