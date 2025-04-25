// ExamPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To access the examId from the URL

import { Link, useNavigate } from 'react-router-dom';
const ExamPage = () => {
  const { examId } = useParams();  // Extract examId from URL
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulating fetching the exam data from an API
    // Replace this with an actual API call
    fetch(`http://localhost:3001/exam/${examId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setExam(data);
        } else {
          setError('Exam not found');
        }
      })
      .catch((err) => setError('Error fetching exam: ' + err.message))
      .finally(() => setLoading(false));
  }, [examId]);

  if (loading) return <p>Loading exam...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="exam-page">
      <h2>{exam.title}</h2>
      <p>{exam.description}</p>
      {/* You can add more exam-related details here */}
    </div>
  );
};

export default ExamPage;
