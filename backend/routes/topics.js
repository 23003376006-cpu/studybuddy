const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const auth = require('../middleware/auth');

// Get all topics for user
router.get('/', auth, async (req, res) => {
  try {
    const topics = await Topic.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single topic
router.get('/:id', auth, async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new topic
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, content, source } = req.body;
    const topic = new Topic({
      user: req.userId,
      title,
      description,
      category,
      content,
      source
    });
    await topic.save();
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update topic
router.put('/:id', auth, async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
