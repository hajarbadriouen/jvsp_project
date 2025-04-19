const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Import JWT for token creation
const EmployeeModel = require('./models/Employee');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/employees")
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));
console.log("MongoDB connection established.");
// JWT secret key 
const JWT_SECRET = 'your_jwt_secret_key'; 



// Login route
app.post("/login", async (req, res) => {
    
    const { email, password } = req.body;
    try {
        const user = await EmployeeModel.findOne({ email: email });
       
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
    
        // Check if the password is correct
        console.log(password, user.password)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("Password comparison result:", isPasswordValid); // Log for debugging
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role }, // Payload includes user ID and role
            JWT_SECRET, // Secret key for encoding
            { expiresIn: '1h' } // Token expiration time (1 hour in this case)
        );

        res.json({
            message: "Login successful",
            token:token, // Send the token in response
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Register route
app.post('/register', async (req, res) => {
   
    console.log("Register route hit"); // Log for debugging
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, email, password, and role are required.' });
    }

    if (!['student', 'teacher'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role. Choose either "student" or "teacher".' });
    }

    try {
        const cleanPassword = password.trim();  // Trim spaces from password

        // Check if the user already exists
        const existingEmployee = await EmployeeModel.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Email is already in use.' });
        }

        const hashedPassword = await bcrypt.hash(cleanPassword, 10);

        const newEmployee = new EmployeeModel({
            name,
            email,
            password: hashedPassword,
            role
        });
        console.log("New employee object:", newEmployee); // Log for debugging

        const savedEmployee = await newEmployee.save();
        res.json(savedEmployee);

    } catch (err) {
        console.error('Error saving employee:', err);
        res.status(500).json({ message: 'Error saving employee', error: err });
    }
});

// Start server
app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});


