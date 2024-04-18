// api.js
const express = require('express');
const router = express.Router();
const { User } = require('./db');

// Signup endpoint
router.post('/signup', async (req, res) => {
  const { id, password, inviteLink } = req.body;

  try {
    // Create a new user
    const user = new User({ id, password, inviteLink });

    // If there's an invite link, find the sender and update their points
    if (inviteLink) {
      const sender = await User.findOne({ inviteLink });
      if (sender) {
        sender.points += 5;
        user.points += 5;
        await sender.save();
      }
    }

    // Save the new user
    await user.save();
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Transactions endpoint
router.post('/transactions', async (req, res) => {
  const { id, amount } = req.body;

  try {
    // Find the user and update their points
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    user.points += amount;
    await user.save();
    res.status(200).send({ message: 'Transaction successful' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
