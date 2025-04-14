const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const EmployeeModel = require('./models/Employee');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/employees")
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Default route to check server
app.get('/', (req, res) => {
    res.send('Welcome to the backend!');
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await EmployeeModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "The password is incorrect" });
    }

    res.json("Success");

  } catch (error) {
    console.error("Login error:", error.message);  // Log the error message
    res.status(500).json({ message: "Server error", error: error.message }); // Include error details
  }
});

// Register route
app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Name, email, password, and role are required.' });
  }

  if (!['student', 'teacher'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Choose either "student" or "teacher".' });
  }

  try {
    const existingEmployee = await EmployeeModel.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new EmployeeModel({
      name,
      email,
      password: hashedPassword,
      role
    });

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
