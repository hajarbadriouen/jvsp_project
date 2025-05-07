import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exams, setExams] = useState([]);
  const [examIdInput, setExamIdInput] = useState('');
  const [submittedExams, setSubmittedExams] = useState([]);
  const navigate = useNavigate();
  const [examResult, setExamResult] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const studentId = localStorage.getItem('userId');

    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

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

    fetch('http://localhost:3001/api/exams', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setExams(data.exams || []);
      })
      .catch(err => {
        setError('Error fetching exams: ' + err.message);
      });

    if (studentId) {
      axios.get(`http://localhost:3001/api/submissions/student/${studentId}`)
        .then(response => {
          setSubmittedExams(response.data || []);
        })
        .catch(error => {
          console.error("Error fetching submitted exams:", error);
        });
    }
  }, []);

  const handleInputChange = (e) => {
    let value = e.target.value.trim();
    const match = value.match(/(?:\/question\/)?([a-f\d]{24})/i);
    if (match) {
      value = match[1];
    }
    setExamIdInput(value);
  };

  const handleViewResult = (examId) => {
    const token = localStorage.getItem('authToken');
    axios.get(`http://localhost:3001/api/exams/${examId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        const exam = response.data;
        const answers = submittedExams.find(submission => submission.examId._id === examId)?.answers || [];
        let totalScore = 0;
        const resultAnswers = exam.questions.map((question, index) => {
          const userAnswer = (answers[index]?.answer || '').trim().toLowerCase();
          const correctAnswerText = (question.options && question.options[question.correctAnswer])
            ? question.options[question.correctAnswer].trim().toLowerCase()
            : question.correctAnswer.toString().trim().toLowerCase();
          const questionScore = question.score || 0;
          const isCorrect = userAnswer === correctAnswerText;
          if (isCorrect) {
            totalScore += questionScore;
          }
          return {
            questionText: question.question,
            userAnswer,
            correctAnswer: correctAnswerText,
            isCorrect,
            score: isCorrect ? questionScore : 0,
          };
        });
        setExamResult({ exam, resultAnswers, totalScore });
      })
      .catch(error => {
        console.error("Error fetching exam details:", error);
      });
  };

  const handleGoToExam = () => {
    if (examIdInput) {
      navigate(`/exam/${examIdInput}/access`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
  <div className="dashboard-wrapper">
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

      <h2>Your Submitted Exams</h2>

      {submittedExams.length === 0 ? (
        <p>You haven't submitted any exams yet.</p>
      ) : (
        <div className="submitted-exams-grid">
          {submittedExams.map((item) => (
            item.examId ? (
              <div key={item.examId._id} className="exam-card">
                <h3>{item.examId.title}</h3>
                <p>{item.answers.length} answer(s)</p>
                <button onClick={() => handleViewResult(item.examId._id)}>
                  View Result
                </button>
              </div>
            ) : (
              <div key={item._id} className="exam-card">
                <p>No exam details available</p>
              </div>
            )
          ))}
        </div>
      )}

      <div className="exam-id-input">
        <h2>Enter Exam ID or URL</h2>
        <input
          type="text"
          placeholder="Enter exam ID or URL"
          value={examIdInput}
          onChange={handleInputChange}
        />
        <button onClick={handleGoToExam}>Go to Exam</button>
      </div>

      {examResult && (
        <div>
          <h3>Exam Result</h3>
          <h4>{examResult.exam.title}</h4>
          <p>{examResult.exam.description}</p>
          <h5>Total Score: {examResult.totalScore} / {examResult.exam.questions.reduce((acc, question) => acc + (question.score || 0), 0)}</h5>

          <ul>
            {examResult.resultAnswers.map((result, index) => (
              <li key={index}>
                <strong>{result.questionText}</strong>
                <p>Your Answer: {result.userAnswer || 'No answer submitted'}</p>
                <p>Correct Answer: {result.correctAnswer}</p>
                <p>{result.isCorrect ? 'Correct' : 'Incorrect'}</p>
                <p>Score: {result.score}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
  );
};

export default StudentDashboard;
