const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

// Define question schema separately for nesting
const questionSchema = new Schema({
  question: { type: String, required: true },
  options: [String], // Only for multiple-choice questions
  correctAnswer: { type: Schema.Types.Mixed, required: true }, // Allowing either string or number
  questionType: { type: String, enum: ['direct', 'multiple-choice'], required: true }, // Ensuring valid question type
  media: {
    type: Object, // Can store any media data (e.g., image, video) for the question
    default: null
  },
  answer: String, // Can be used to store the student's answer if needed
  tolerance: { type: Number, default: 0 }, // Default tolerance value
  duration: { type: Number, default: 30 }, // Default duration for the question
  score: { type: Number, default: 1 }, // Default score for the question
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
