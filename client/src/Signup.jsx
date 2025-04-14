import { Link } from 'react-router-dom';
import { useState } from "react"; 
import axios from 'axios'
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation


function Signup() { 
  const [role, setRole] = useState(); // State for the role selection
  const [name, setName] = useState(); // State for the name input
  const [email, setEmail] = useState(); // State for the email input
  const [password, setPassword] = useState(); // State for the password input
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!role) {
      alert('Please select a role!');
      return; // Prevent submission if role is not selected
    }
    axios.post('http://localhost:3001/register', { name, email, password, role })
    .then(result => {
      console.log(result);
      alert("Registered successfully!");
      navigate('/login');
    })    
      .catch(err => console.log(err));
  }
  

  // Handle role change
  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  return ( 
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100"> 
      <div className="bg-white p-3 rounded w-25"> 
        <h2>Register</h2> 
        <form onSubmit={handleSubmit}> 
          <div className="mb-3"> 
            <label htmlFor="name"> 
              <strong>Name</strong> 
            </label> 
            <input 
              type="text" 
              placeholder="Enter Name" 
              autoComplete="off" 
              name="name" 
              className="form-control rounded-0"
              onChange={(e) => setName(e.target.value)} // Update name state on input change
            />
          </div>
          
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
              onChange={(e) => setPassword(e.target.value)} // Update password state on input change
            />
          </div>
          
          {/* Role Dropdown */}
          <div className="mb-3">
            <label htmlFor="role">
              <strong>Role</strong>
            </label>
            <select
              name="role"
              value={role}
              onChange={handleRoleChange}
              className="form-control rounded-0"
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Register
          </button>  
        </form>
        
        <p>Already have an Account?</p> 
        <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
