import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function QuestionPage() {
  const { id } = useParams();
  const [exam, setExam] = useState(null); 
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitMessage, setSubmitMessage] = useState(null);

  useEffect(() => {
    if (!id) {
      console.error("Invalid ID:", id);
      setError("Invalid exam ID");
      setLoading(false);
      return;
    }


    setLoading(true);

    // Send request to fetch exam data with Authorization token
    axios.get(`http://localhost:3001/api/exams/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming token is saved in localStorage
      },
    })
      .then((response) => {
        const foundExam = response.data;
        setExam(foundExam);
        setQuestion(foundExam.questions[0]); // show first question
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        if (error.response && error.response.status === 404) {
          setError('Exam not found.');
        } else {
          setError('Server error. Please try again later.');
        }
        setLoading(false);
      });
      
  }, [id]);

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = () => {
    if (loading) return;

    // Submit the answer for the current question
    axios.post('http://localhost:3001/api/submitAnswer', {
      examId: id,
      questionId: question._id,
      answer: answer,
    })
      .then(response => {
        setSubmitMessage('Answer submitted successfully!');
        setAnswer(""); // Clear the answer after submission
      })
      .catch(error => {
        setSubmitMessage('Failed to submit answer. Please try again.');
      });
  };

  if (loading) return <div>Loading question...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>{exam?.title || 'Exam Title'}</h2>
      <p>{exam?.description || 'No description available'}</p>

      <h3>Question: {question?.question || 'No question available'}</h3>

      {question?.questionType === 'multiple-choice' && (
        <div>
          {question.options.map((option, index) => (
            <label key={index}>
              <input
                type="radio"
                name={`question-${question._id}`}
                value={option}
                checked={answer === option}
                onChange={handleAnswerChange}
              />
              {option}
            </label>
          ))}
        </div>
      )}

      {question?.questionType !== 'multiple-choice' && (
        <textarea
          value={answer}
          onChange={handleAnswerChange}
          placeholder="Your answer here"
        />
      )}

      <button 
        onClick={handleSubmit} 
        disabled={loading || !answer}
        aria-label="Submit your answer"
      >
        Submit Answer
      </button>

      {submitMessage && <div>{submitMessage}</div>}
    </div>
  );
}

export default QuestionPage;
