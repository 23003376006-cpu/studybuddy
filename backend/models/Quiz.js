const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [{
    questionText: String,
    options: [String],
    correctAnswer: String,
    userAnswer: String,
    isCorrect: Boolean
  }],
  score: Number,
  totalQuestions: Number,
  percentage: Number,
  attemptNumber: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quiz', quizSchema);
