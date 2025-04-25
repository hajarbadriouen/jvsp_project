import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const [exams, setExams] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const navigate = useNavigate();

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem('token');  // Assuming token is stored in localStorage
  
      const response = await fetch('http://localhost:3001/exams', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Bearer ${token}  // Include the token in the Authorization header
        }
      });
  
      if (!response.ok) {
        throw new Error('Error fetching exams');
      }
  
      const data = await response.json();
  
      // Ensure data is an array before setting state
      if (Array.isArray(data)) {
        setExams(data);
      } else {
        console.error('Expected an array of exams, but got:', data);
      }
    } catch (err) {
      console.error('Error fetching exams:', err);
    }
  };
  
  useEffect(() => {
    fetchExams();
  }, []);
  

  const goToExamPage = (examId) => {
    navigate(/exam/edit/${examId});
  };

  const handleCreateExam = async (title, description) => {
    try {
      const token = localStorage.getItem('token');  // Assuming token is stored in localStorage
  
      const response = await fetch('http://localhost:3001/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Bearer ${token}  // Include the token in the Authorization header
        },
        body: JSON.stringify({ title, description })
      });
  
      if (!response.ok) {
        throw new Error('Error creating exam');
      }
  
      const data = await response.json();
      setExams([...exams, data]);  // Add the newly created exam to the state
      setNewTitle('');
      setNewDescription('');
    } catch (error) {
      console.error('Error creating exam:', error);
    }
  };
  

  return (
    <div>
      <h2>Teacher Dashboard</h2>

      <h3>Create Exam</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleCreateExam(newTitle, newDescription);
      }}>
        <input
          type="text"
          placeholder="Exam Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Exam Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          required
        ></textarea>
        <button type="submit">Create Exam</button>
      </form>

      <h3>Created Exams</h3>
      {exams.length === 0 ? (
        <p>No exams created yet.</p>
      ) : (
        exams.map((exam) => (
          <div key={exam._id} className="exam-card">
            <h4>{exam.title}</h4>
            <p>{exam.description}</p>
            <button onClick={() => goToExamPage(exam._id)}>Go to Exam</button>
          </div>
        ))
      )}
    </div>
  );
};

export default TeacherDashboard;
