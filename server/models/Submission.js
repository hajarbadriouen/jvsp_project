const mongoose = require('mongoose');

// Define the Submission schema
const submissionSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam', // Reference to the Exam model
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question', // Reference to the Question model
      required: true,
    },
    answer: {
      type: String, // Store the answer as a string
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    toleranceApplied: {
      type: Number, // Tolerance percentage applied, like 10% or 0 for no tolerance
      required: true,
    },
    score: {
      type: Number, // Final score for the answer, out of 100
      required: true,
    },
    submissionDate: {
      type: Date,
      default: Date.now, // The date the answer was submitted
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create and export the Submission model
module.exports = mongoose.model('Submission', submissionSchema);
