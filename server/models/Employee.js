const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

// Employee schema definition
const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Make name required
  },
  email: {
    type: String,
    required: true, // Make email required
    unique: true,   // Ensure email is unique
  },
  password: {
    type: String,
    required: true, // Make password required
  },
  role: {
    type: String,
    required: true, // Make role required
    enum: ['student', 'teacher'], // Restrict role to 'student' or 'teacher'
  },
});


// Create model based on schema
const EmployeeModel = mongoose.model('Employees', EmployeeSchema);

module.exports = EmployeeModel;
