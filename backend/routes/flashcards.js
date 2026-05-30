const express = require('express');
const router = express.Router();
const Flashcard = require('../models/Flashcard');
const auth = require('../middleware/auth');

// Get flashcards for a topic
router.get('/topic/:topicId', auth, async (req, res) => {
  try {
    const flashcards = await Flashcard.find({
      topic: req.params.topicId,
      user: req.userId
    });
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create flashcard
router.post('/', auth, async (req, res) => {
  try {
    const { topic, question, answer, difficulty } = req.body;
    const flashcard = new Flashcard({
      topic,
      user: req.userId,
      question,
      answer,
      difficulty
    });
    await flashcard.save();
    res.status(201).json(flashcard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update flashcard review
router.patch('/:id/review', auth, async (req, res) => {
  try {
    const flashcard = await Flashcard.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { reviewCount: 1 },
        lastReviewedAt: new Date()
      },
      { new: true }
    );
    res.json(flashcard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
