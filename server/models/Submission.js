const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true }, // Link to the Exam
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, // Link to the Student
  answers: [
    {
      question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }, // Link to the Question
      answer: String, // The student's answer
    }
  ],
  dateSubmitted: { type: Date, default: Date.now },
  score: Number // Optionally, store the score if you're grading
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
