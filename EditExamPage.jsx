import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditExamPage.css'; // Import the CSS

const EditExamPage = () => {
  const { examId } = useParams(); // Get examId from the URL
  const navigate = useNavigate();

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

  

  const handleAddQuestion = () => {
    const newExam = { ...exam };
    newExam.questions.push({
      question: newQuestion,
      options: newOptions,
      correctAnswer,
      questionType,
      media,
      answer,
      tolerance,
      duration,
      score
    });
    setExam(newExam);
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

  const handleSaveExam = () => {
    // Save the exam, you can save it to your backend
    console.log('Exam Saved:', exam);
    navigate('/teacher'); // Navigate back to teacher dashboard
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Edit Exam - {exam.title}</h2>
        <p>{exam.description}</p>

        <h3>Create Exam Details</h3>
        <label htmlFor="examTitle">Titre de l'examen :</label>
        <input
          type="text"
          id="examTitle"
          placeholder="Ex : Examen de Mathématiques"
          value={exam.title}
          onChange={(e) => setExam({ ...exam, title: e.target.value })}
        />
        <label htmlFor="examDescription">Description :</label>
        <textarea
          id="examDescription"
          placeholder="Description de l'examen"
          value={exam.description}
          onChange={(e) => setExam({ ...exam, description: e.target.value })}
        />
        <label htmlFor="targetAudience">Public ciblé :</label>
        <input
          type="text"
          id="targetAudience"
          placeholder="Ex : 2e année SMI, S4, groupe A"
          value={exam.targetAudience}
          onChange={(e) => setExam({ ...exam, targetAudience: e.target.value })}
        />
        <label htmlFor="examLink">Lien unique d'accès :</label>
        <input
          type="text"
          id="examLink"
          value={exam.examLink}
          disabled
        />
        <a href="page-suivante.html" className="btn">Generer un lien unique</a>
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
          <option value="qcm">QCM</option>
        </select>

        <label htmlFor="questionText">Énoncé de la question :</label>
        <input
          type="text"
          id="questionText"
          placeholder="Entrez la question"
          value={newQuestion}
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
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        <label htmlFor="tolerance">Taux de tolérance (%):</label>
        <input
          type="number"
          id="tolerance"
          value={tolerance}
          onChange={(e) => setTolerance(e.target.value)}
          min="0"
          max="100"
        />

        {questionType === 'qcm' && (
          <>
            <label htmlFor="options">Options (pour QCM) :</label>
            {newOptions.map((option, index) => (
              <input
                key={index}
                type="text"
                placeholder={Option ${index + 1}}
                value={option}
                onChange={(e) => {
                  const options = [...newOptions];
                  options[index] = e.target.value;
                  setNewOptions(options);
                }}
              />
            ))}

            <label htmlFor="correctAnswers">Réponses correctes (pour QCM) :</label>
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(parseInt(e.target.value))}
            >
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
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <label htmlFor="score">Note :</label>
        <input
          type="number"
          id="score"
          placeholder="Note pour cette question"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />

        <button type="button" onClick={handleAddQuestion}>Ajouter la question</button>
      </div>

      <div className="card">
        <h3>Questions ajoutées :</h3>
        <ul>
          {exam.questions.map((question, index) => (
            <li key={index}>
              <p>{question.question}</p>
              <ul>
                {question.options.map((option, i) => (
                  <li key={i}>
                    {option} {i === question.correctAnswer ? '(Correct)' : ''}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <button onClick={handleSaveExam}>Save Exam</button>
      </div>
    </div>
  );
};

export default EditExamPage;
