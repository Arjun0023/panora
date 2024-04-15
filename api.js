// api.js
const express = require('express');
const router = express.Router();
const { UserModel } = require('./db');

router.post('/signup', async (req, res) => {
  try {
    const { id, password, inviteLink } = req.body;
    const user = await UserModel.create({ id, password, inviteLink });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { id, password } = req.body;
    const user = await UserModel.findOne({ id, password });
    if (!user) throw new Error('Invalid credentials');
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/transaction', async (req, res) => {
  try {
    const { id, points } = req.body;
    const user = await UserModel.findOneAndUpdate(
      { id },
      { $inc: { points } },
      { new: true }
    );
    if (!user) throw new Error('User not found');
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
