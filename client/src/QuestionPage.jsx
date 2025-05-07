import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function QuestionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null); 
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [result, setResult] = useState(null);

  // Retrieve studentId from localStorage (same as in StudentDashboard)
  const studentId = localStorage.getItem('userId'); // Ensure this key exists in localStorage

  useEffect(() => {
    if (!id) {
      console.error("Invalid ID:", id);
      setError("Invalid exam ID");
      setLoading(false);
      return;
    }

    setLoading(true);

    axios.get(`http://localhost:3001/api/exams/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        const foundExam = response.data;
        setExam(foundExam);
        setQuestions(foundExam.questions);
        setTimeRemaining(foundExam.questions[0]?.duration || 0);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(error.response?.status === 404 ? 'Exam not found.' : 'Server error. Please try again later.');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    let timer;
    if (timeRemaining > 0 && !isTimeOver) {
      timer = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsTimeOver(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmitAll = () => {
    if (!studentId) {
      console.error('Student ID is missing.');
      setSubmitMessage('Student ID is missing. Please log in again.');
      return;
    }

    const submissionData = questions.map((question, index) => ({
      questionId: question._id,
      answer: answers[index] || '',
    }));

    axios.post('http://localhost:3001/api/submissions/submit', {
      studentId,        // Ensure studentId is available
      examId: id,       // exam ID
      answers: submissionData
    })
    .then(response => {
      const { message, submission } = response.data;

      setSubmitMessage(message);
      setResult({
        finalScore: submission.totalScore,
        maxScore: submission.answers.length * 100
      });

      // Redirect to dashboard and pass the submitted exam
      navigate('/student', { state: { justSubmitted: submission } });
    })
    .catch(error => {
      console.error('Error while submitting all answers:', error);
      setSubmitMessage('Failed to submit answers. Please try again.');
    });
  };

  const handleNextQuestion = () => {
    if (answers[questionIndex] === undefined || answers[questionIndex] === '') {
      alert('Please answer the question before moving to the next one.');
      return;
    }
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(prevIndex => prevIndex + 1);
      setTimeRemaining(questions[questionIndex + 1]?.duration || 0);
      setIsTimeOver(false);
    }
  };

  if (loading) return <div>Loading question...</div>;
  if (error) return <div>{error}</div>;

  const currentQuestion = questions[questionIndex];

  return (
    <div>
      <h2>{exam?.title}</h2>
      <p>{exam?.description}</p>

      <h3>Question {questionIndex + 1}: {currentQuestion?.question}</h3>

      {currentQuestion?.tolerance && <p><strong>Tolerance: </strong>{currentQuestion.tolerance}%</p>}
      {currentQuestion?.duration && <p><strong>Time Remaining: </strong>{timeRemaining} seconds</p>}
      {isTimeOver && <div><strong>Time is up!</strong></div>}

      {currentQuestion?.questionType === 'multiple-choice' ? (
        <div>
          {currentQuestion.options.map((option, index) => (
            <label key={index}>
              <input
                type="radio"
                name={`question-${currentQuestion._id}`}
                value={option}
                checked={answers[questionIndex] === option}
                onChange={handleAnswerChange}
              />
              {option}
            </label>
          ))}
        </div>
      ) : (
        <textarea value={answers[questionIndex]} onChange={handleAnswerChange} placeholder="Your answer here" />
      )}

      {questionIndex === questions.length - 1 && (
        <button 
          onClick={handleSubmitAll} 
          disabled={loading || !answers[questionIndex] || isTimeOver}
        >
          Submit All Answers
        </button>
      )}

      {submitMessage && <div>{submitMessage}</div>}

      {result && result.finalScore !== undefined && (
        <div>
          <h3>Exam Completed!</h3>
          <p><strong>Total Score: </strong>{result.finalScore} / {result.maxScore}</p>
        </div>
      )}

      {questionIndex < questions.length - 1 && (
        <button onClick={handleNextQuestion}>
          Next Question
        </button>
      )}
    </div>
  );
}

export default QuestionPage;
