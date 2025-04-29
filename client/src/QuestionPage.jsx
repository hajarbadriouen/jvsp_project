import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function QuestionPage() {
  const { id } = useParams();
  const [exam, setExam] = useState(null); 
  const [questions, setQuestions] = useState([]); // Store all questions
  const [questionIndex, setQuestionIndex] = useState(0); // Track the current question index
  const [answer, setAnswer] = useState(""); // The answer state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0); 
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [result, setResult] = useState(null); 

  useEffect(() => {
    if (!id) {
      console.error("Invalid ID:", id);
      setError("Invalid exam ID");
      setLoading(false);
      return;
    }

    setLoading(true);

    // Fetch exam data with Authorization token
    axios.get(`http://localhost:3001/api/exams/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, 
      },
    })
      .then((response) => {
        const foundExam = response.data;
        setExam(foundExam);
        setQuestions(foundExam.questions); // Store all questions
        setTimeRemaining(foundExam.questions[0]?.duration || 0); // Set timer for first question
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

  const handleAnswerChange = (e) => setAnswer(e.target.value);

  const handleSubmit = () => {
    console.log("Submit clicked");
  
    if (loading || isTimeOver) return;
  
    const currentQuestion = questions[questionIndex];
    console.log("Submitting answer for question:", currentQuestion);
    console.log("Answer being sent:", answer); // Debugging answer value
  
    console.log("Making API request...");
  
    axios.post('http://localhost:3001/api/submitAnswer', {
      examId: id,
      questionId: currentQuestion._id,
      answer: answer,
      tolerance: currentQuestion?.tolerance,
    })
      .then(response => {
        console.log('Response from server:', response.data); // Debugging server response
        const { isCorrect, toleranceApplied, score } = response.data;
        setSubmitMessage(isCorrect ? 'Correct answer!' : 'Incorrect answer.');
        setResult({
          tolerance: toleranceApplied,
          score: score,
        });
        setAnswer(""); // Clear the answer field after submission
      })
      .catch(error => {
        console.error('Error while submitting answer:', error); // Debugging error
        setSubmitMessage('Failed to submit answer. Please try again.');
      });
  };
  
  const updateExam = async (examId, updatedQuestions) => {
    const response = await fetch(`/api/exams/edit/${examId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questions: updatedQuestions,
      }),
    });
  
    const data = await response.json();
    if (response.ok) {
      console.log('Exam updated successfully:', data);
    } else {
      console.error('Error updating exam:', data.error);
    }
  };
  
  const handleNextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(prevIndex => prevIndex + 1);
      setAnswer(""); // Reset the answer field
      setTimeRemaining(questions[questionIndex + 1]?.duration || 0);
      setIsTimeOver(false); // Reset the timer for the next question
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
                checked={answer === option}
                onChange={handleAnswerChange}
              />
              {option}
            </label>
          ))}
        </div>
      ) : (
        <textarea value={answer} onChange={handleAnswerChange} placeholder="Your answer here" />
      )}

      <button 
        onClick={handleSubmit} 
        disabled={loading || !answer || isTimeOver}
      >
        Submit Answer
      </button>

      {submitMessage && <div>{submitMessage}</div>}

      {result && (
        <div>
          <p><strong>Tolerance Applied: </strong>{result.tolerance}%</p>
          <p><strong>Final Mark: </strong>{result.score} / 100</p>
        </div>
      )}

      <button onClick={handleNextQuestion} disabled={questionIndex === questions.length - 1}>
        Next Question
      </button>
    </div>
  );
}

export default QuestionPage;
