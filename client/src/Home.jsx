import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; 

const Home = () => {
  return (
    <div className="home-container">
      {/* Top bar */}
      <div className="top-bar">
        <Link to="/login" className="connect-button">
          Connect
        </Link>
      </div>

    
      <div className="main-content">
        <h1 className="title">OnlineExam</h1>
        <p className="subtitle">
          Welcome to OnlineExam – a smart platform to easily manage and take exams online.
        </p>

        <h2 className="section-title">Main Features:</h2>
        <ul className="feature-list">
          <li><strong>Advanced exam creation:</strong> Multiple choice (MCQ), true/false, open-ended questions.</li>
          <li><strong>Flexible management:</strong> Organize exams by subject, class, or special group.</li>
          <li><strong>Exam modes:</strong> Timed, automatically or manually graded, secure against cheating.</li>
        </ul>

        <h2 className="section-title center">Why choose OnlineExam?</h2>
        <ul className="feature-list">
          <li>✓ Time-saving with automatic grading.</li>
          <li>✓ Robust and secure platform against cheating.</li>
          <li>✓ Clear statistics to analyze student performance.</li>
          <li>✓ Responsive and professional technical support.</li>
        </ul>
      </div>

      <div className="footer">
        <p>© 2025 ExamOnline - Tous droits réservés.</p>
      </div>
    </div>
  );
};

export default Home;
