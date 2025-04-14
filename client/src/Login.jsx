import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");  // Added state for error handling
  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault();

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

    axios.post('http://localhost:3001/login', { email, password })
      .then(result => {
        setLoading(false);
        console.log(result);
        if (result.data === "Success") {
          navigate('/home');  // Redirect to the home page after successful login
        } else {
          setError("Invalid credentials!");  // Display error message if login fails
        }
      })
      .catch(err => {
        setLoading(false);
        console.error(err);
        setError("Login failed. Please try again.");  // Display error if the request fails
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100"> 
      <div className="bg-white p-3 rounded w-25"> 
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
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter password"
              name="password"
              className="form-control rounded-0"
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>} {/* Display error message if exists */}
          
          <button type="submit" className="btn btn-success w-100 rounded-0" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>  
        </form>

        <p className="mt-3">Don't have an account?</p> 
        <Link to="/register" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
          Register
        </Link>
      </div>
    </div>
  );
}

export default Login;
