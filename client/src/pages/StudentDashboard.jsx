import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios';
import './StudentDashboard.css'; // Import your CSS file for styling

const StudentDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    // Fetch user data (e.g., name, email, role)
    fetch('http://localhost:3001/student', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
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
      .finally(() => setLoading(false));

    
  }, []);

  const goToExamPage = (examId) => {
    // Navigate to exam page with examId as a parameter
    navigate(`/exam/${examId}`);
  };

  if (loading) {
    return <p>Loading...</p>;
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

      <h3>Available Exams</h3>
      {exams.length === 0 ? (
        <p>No exams available at the moment.</p>
      ) : (
        exams.map((exam) => (
          <div key={exam._id} className="exam-card" onClick={() => goToExamPage(exam._id)}>
            <h4>{exam.title}</h4>
            <p>{exam.description}</p>
            <button>Go to Exam</button>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentDashboard;
