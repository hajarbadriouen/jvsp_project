import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PasswordInput from './PasswordInput';
import './AuthForm.css';


function Login() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");  // Added state for error handling
  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);

    // Input validation
    if (!email || !password) {
      alert('Please fill in all fields!');
      return;
    }

    // Email validation (basic)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      alert('Please enter a valid email!');
      return;
    }

    setLoading(true);
    setError("");  // Reset error state before sending the request

    // Trim the password before sending it
    const cleanPassword = password.trim(); 
    console.log( { email:email, password: cleanPassword });
   
   
    // After successful login
    axios.post('http://localhost:3001/login', { email: email, password: cleanPassword })
    .then(result => {
      setLoading(false);
      console.log(result.data); // for debugging
  
      if (result.data.token) {
        const token = result.data.token;
        const role = result.data.user.role; // correctly accessed from user object
  
        localStorage.setItem("token", token);
  
        if (role === 'student') {
          navigate('/student-dashboard');
        } else if (role === 'teacher') {
          navigate('/teacher-dashboard');
        }
      } else {
        setError("Invalid credentials!");
      }
    })
    .catch(err => {
      setLoading(false);
      console.error(err);
      setError("Login failed. Please try again.");
    });
  

  };

  return (
    <div className="auth-wrapper">
      <div className="auth-form-container"> 
        <h2>Login</h2> 
        <form onSubmit={handleSubmit}> 
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>   
            <input
              type="email"
              placeholder="Enter email"
              autoComplete="off"
              name="email"
              className="form-control"
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
  
          <PasswordInput 
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>  
        </form>
  
        <div className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
  
}

export default Login;
