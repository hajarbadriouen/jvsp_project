const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');  // Import uuid for unique link generation

// Define question schema separately for nesting
const questionSchema = new Schema({
  question: { type: String, required: true },
  options: [String],
  correctAnswer: Number,
  questionType: String,
  media: {
    type: Object, // or change to String if you're just storing a URL
    default: null
  },
  answer: String,
  tolerance: String,
  duration: String,
  score: String,
});

// Exam Schema
const examSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  examLink: {
    type: String,  // Unique URL for each exam
    default: () => uuidv4(), // Generate a unique exam link using uuid
  },
  questions: [questionSchema] // Embed the questions directly
});

// Create a pre-save hook to generate the link if it's not set yet (optional)
examSchema.pre('save', function (next) {
  if (!this.examLink) {
    this.examLink = uuidv4(); // Generate a unique link if not set
  }
  next();
});

const Exam = mongoose.model('Exam', examSchema);
module.exports = Exam;
