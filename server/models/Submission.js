const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      answer: { type: String },
    }
  ],
});
const Submission = mongoose.model('Submission', SubmissionSchema);
module.exports = Submission;
