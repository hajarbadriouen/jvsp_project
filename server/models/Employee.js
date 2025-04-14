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

// Hash password before saving
EmployeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip if password is not modified

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
  } catch (err) {
    next(err);
  }
});

// Create model based on schema
const EmployeeModel = mongoose.model('Employee', EmployeeSchema);

module.exports = EmployeeModel;
