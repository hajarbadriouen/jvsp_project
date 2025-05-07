import { Link } from 'react-router-dom';
import { useState } from "react"; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import PasswordInput from './PasswordInput'; // Import PasswordInput component for show/hide password functionality
import './AuthForm.css';

function Signup() { 
  const [role, setRole] = useState(""); // State for the role selection
  const [name, setName] = useState(""); // State for the name input
  const [email, setEmail] = useState(""); // State for the email input
  const [password, setPassword] = useState(""); // State for the password input
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate if role is selected
    if (!role) {
      alert('Please select a role!');
      return;
    }

    // Trim password before submitting
    const cleanPassword = password.trim();

    axios.post('http://localhost:3001/register', { name, email, password: cleanPassword, role })
      .then(result => {
        console.log(result);
        alert("Registered successfully!");
        navigate('/login');
      })    
      .catch(err => console.log(err));
  };

  // Handle role change
  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  return ( 
    <div className="signup-wrapper"> 
      <div className="signup-form-container"> 
        <h2>Register</h2> 
        <form onSubmit={handleSubmit}> 
          
          {/* Name Input */}
          <div className="mb-3"> 
            <label htmlFor="name"> 
              <strong>Name</strong> 
            </label> 
            <input 
              type="text" 
              placeholder="Enter Name" 
              autoComplete="off" 
              name="name" 
              className="form-control"
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          
          {/* Email Input */}
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
  
          {/* Password Input */}
          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
          
          {/* Role Selection */}
          <div className="mb-3">
            <label htmlFor="role">
              <strong>Role</strong>
            </label>
            <select
              name="role"
              value={role}
              onChange={handleRoleChange}
              className="form-control"
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          
          {/* Submit Button */}
          <button type="submit" className="btn w-100">
            Register
          </button>  
        </form>
        
        {/* Link to Login Page */}
        <div className="login-link">
          Already have an Account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
