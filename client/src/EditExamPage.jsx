import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditExamPage.css'; // Import the CSS

const EditExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [exam, setExam] = useState({ title: '', description: '', targetAudience: '', examLink: '', questions: [] });
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [questionType, setQuestionType] = useState('direct');
  const [media, setMedia] = useState(null);
  const [answer, setAnswer] = useState('');
  const [tolerance, setTolerance] = useState('');
  const [duration, setDuration] = useState('');
  const [score, setScore] = useState('');
  const [loading, setLoading] = useState(true); // <<< You forgot to define loading

  const handleAddQuestion = () => {
    if (!exam || !Array.isArray(exam.questions)) {
      console.error("Exam or exam.questions is undefined.");
      return;
    }

    const newQuestionObject = {
      question: newQuestion,
      options: newOptions,
      correctAnswer,
      questionType,
      media,
      answer,
      tolerance,
      duration,
      score,
    };

    const updatedExam = {
      ...exam,
      questions: [...exam.questions, newQuestionObject],
    };

    setExam(updatedExam);

    // Reset inputs
    setNewQuestion('');
    setNewOptions(['', '', '', '']);
    setCorrectAnswer(0);
    setQuestionType('direct');
    setMedia(null);
    setAnswer('');
    setTolerance('');
    setDuration('');
    setScore('');
  };

  const handleSaveExam = async () => {
    try {
      const token = localStorage.getItem('token');
  
      const payload = {
        title: exam.title,
        description: exam.description,
        targetAudience: exam.targetAudience,
        examLink: exam.examLink,
        questions: exam.questions,
      };
  
      const response = await fetch(`http://localhost:3001/api/exams/${examId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error('Failed to update exam');
  
      console.log('Exam saved successfully');
      
      // Refetch exam after save
      fetchExam();  // Call the function to fetch the updated data
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };
   
  const fetchExam = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/exams/${examId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Fetched data:', data); 
      if (Array.isArray(data)) {
        setExams(data);
        setExam(data[0]);
      } else if (data) {
        setExams([data]);
        setExam(data);
      } else {
        console.error('No data received:', data);
      }
      
    } catch (error) {
      console.error('Error fetching exam:', error);
    } finally {
      setLoading(false);
    }  
  };
  
  // Now useEffect just calls it:
  useEffect(() => {
    fetchExam();
  }, [examId]);
  
  const generateLink = async () => {
    try {
      console.log("Exam ID:", examId);

      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:3001/api/exams/${examId}/generate-link`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate link');
      }

      const data = await response.json();
      const generatedLink = data.link;

      setExam((prevExam) => ({
        ...prevExam,
        examLink: generatedLink,
      }));
    } catch (error) {
      console.error('Error generating link:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <h2>{exam.title}</h2>
        <p>{exam.description}</p>

        <h3>Create Exam Details</h3>

        <form className="exam-form">
          <div className="form-group">
            <label htmlFor="examTitle">Titre de l'examen :</label>
            <input
              type="text"
              id="examTitle"
              placeholder="Ex : Examen de Mathématiques"
              value={exam.title || ''}
              onChange={(e) => setExam({ ...exam, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="examDescription">Description :</label>
            <textarea
              id="examDescription"
              placeholder="Description de l'examen"
              value={exam.description || ''}
              onChange={(e) => setExam({ ...exam, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="targetAudience">Public ciblé :</label>
            <input
              type="text"
              id="targetAudience"
              placeholder="Ex : 2e année SMI, S4, groupe A"
              value={exam.targetAudience || ''}
              onChange={(e) => setExam({ ...exam, targetAudience: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="examLink">Lien unique d'accès :</label>
            <input
              type="text"
              id="examLink"
              value={exam.examLink || ''}
              disabled
            />
          </div>

          <button type="button" onClick={generateLink}>Générer un lien unique</button>
        </form>
      </div>

      <div className="card">
        <h3>Add a Question</h3>

        <label htmlFor="questionType">Type de question :</label>
        <select
          id="questionType"
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
        >
          <option value="direct">Question directe</option>
          <option value="multiple-choice">QCM</option>
        </select>

        <label htmlFor="questionText">Énoncé de la question :</label>
        <input
          type="text"
          id="questionText"
          placeholder="Entrez la question"
          value={newQuestion || ''}
          onChange={(e) => setNewQuestion(e.target.value)}
        />

        <label htmlFor="media">Joindre un média :</label>
        <input
          type="file"
          id="media"
          onChange={(e) => setMedia(e.target.files[0])}
        />

        <label htmlFor="answer">Réponse :</label>
        <input
          type="text"
          id="answer"
          placeholder="Réponse attendue"
          value={answer || ''}
          onChange={(e) => setAnswer(e.target.value)}
        />

        <label htmlFor="tolerance">Taux de tolérance (%):</label>
        <input
          type="number"
          id="tolerance"
          value={tolerance || ''}
          onChange={(e) => setTolerance(e.target.value)}
          min="0"
          max="100"
        />

        {questionType === 'multiple-choice' && (
          <>
            <label htmlFor="options">Options (pour QCM) :</label>

            {newOptions.map((option, index) => (
              <div key={index} className="option-input">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option || ''}
                  onChange={(e) => {
                    const options = [...newOptions]; // Copy the options array
                    options[index] = e.target.value; // Update the value for the current option
                    setNewOptions(options); // Update state with the new options array
                  }}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                setNewOptions([...newOptions, '']); // Add an empty string for a new option
              }}
            >
              Add Option
            </button>

            <label htmlFor="correctAnswers">Réponses correctes (pour QCM) :</label>

            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(parseInt(e.target.value))}
            >
              <option value="">Select the correct answer</option>
              {newOptions.map((option, index) => (
                <option key={index} value={index}>
                  {option}
                </option>
              ))}
            </select>
          </>
        )}

        <label htmlFor="duration">Durée (en secondes) :</label>
        <input
          type="number"
          id="duration"
          placeholder="Durée en secondes"
          value={duration || ''}
          onChange={(e) => setDuration(e.target.value)}
        />

        <label htmlFor="score">Note :</label>
        <input
          type="number"
          id="score"
          placeholder="Note pour cette question"
          value={score || ''}
          onChange={(e) => setScore(e.target.value)}
        />

        <button type="button" onClick={handleAddQuestion} disabled={!newQuestion.trim()}>
          Ajouter la question
        </button>
      </div>

      <div className="card">
        <h3>Questions ajoutées :</h3>
        <ul>
          {exam.questions.map((question, index) => (
            <li key={index}>
              <p>{question.question}</p>
              {question.options && question.options.length > 0 && (
                <ul>
                  {question.options.map((option, i) => (
                    <li key={i}>
                      {option} {i === question.correctAnswer ? '(Correct)' : ''}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <button onClick={handleSaveExam}>Save Exam</button>
      </div>
    </div>
  );
};

export default EditExamPage;
