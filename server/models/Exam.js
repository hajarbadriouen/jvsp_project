const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  questions: [questionSchema] // Embed the questions directly
});

const Exam = mongoose.model('Exam', examSchema);
module.exports = Exam;
