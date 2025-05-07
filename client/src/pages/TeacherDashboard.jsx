import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherDashboard.css'; // <-- Don't forget this line

const TeacherDashboard = () => {
  const [exams, setExams] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const navigate = useNavigate();

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/exams', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error fetching exams');
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setExams(data);
      } else if (data) {
        setExams([data]);
      }
    } catch (err) {
      console.error('Error fetching exams:', err);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const goToExamPage = (examId) => {
    navigate(`/exam/edit/${examId}`);
  };

  const handleCreateExam = async (title, description) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:3001/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
      });

      if (!response.ok) {
        throw new Error('Error creating exam');
      }

      const data = await response.json();
      setExams((prevExams) => [...prevExams, data]);
      setNewTitle('');
      setNewDescription('');
    } catch (error) {
      console.error('Error creating exam:', error);
    }
  };

  return (
    <div className="page-container">
    <h2 className="welcome-title">Welcome, Teacher! 🎓</h2>
    <p className="welcome-subtitle">Manage your exams easily from your dashboard.</p>
  
    {/* Create Exam Form */}
    <div className="create-exam-card">
      <h3>Create a New Exam</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleCreateExam(newTitle, newDescription);
      }}>
        <input
          className="exam-input"
          type="text"
          placeholder="Exam Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
        />
        <textarea
          className="exam-textarea"
          placeholder="Exam Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          required
        ></textarea>
        <button className="create-exam-button" type="submit">Create Exam</button>
      </form>
    </div>
  
    {/* Created Exams */}
    <div className="created-exams-section">
      <h3>Your Created Exams</h3>
      {exams.length === 0 ? (
        <p>No exams created yet.</p>
      ) : (
        <div className="exams-grid">
          {exams.map((exam) => (
            <div key={exam._id} className="exam-card">
              <h4>{exam.title}</h4>
              <p>{exam.description}</p>
              <button onClick={() => goToExamPage(exam._id)}>Go to Exam</button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
  
  
  );
};

export default TeacherDashboard;
