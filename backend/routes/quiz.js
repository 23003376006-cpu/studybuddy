const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const auth = require('../middleware/auth');
const { generateQuizQuestions } = require('../utils/aiHelper');

// Get quiz history for a topic
router.get('/history/:topicId', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      topic: req.params.topicId,
      user: req.userId
    }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate new quiz
router.post('/generate/:topicId', auth, async (req, res) => {
  try {
    const { topicContent } = req.body;
    const questions = await generateQuizQuestions(topicContent);
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit quiz answers
router.post('/submit', auth, async (req, res) => {
  try {
    const { topic, questions } = req.body;
    
    let score = 0;
    questions.forEach(q => {
      if (q.userAnswer === q.correctAnswer) {
        score++;
        q.isCorrect = true;
      } else {
        q.isCorrect = false;
      }
    });

    const attemptNumber = await Quiz.countDocuments({ topic, user: req.userId }) + 1;
    
    const quiz = new Quiz({
      topic,
      user: req.userId,
      questions,
      score,
      totalQuestions: questions.length,
      percentage: (score / questions.length) * 100,
      attemptNumber
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
