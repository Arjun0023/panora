const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { User } = require('./db');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { walletId, password } = req.body;
    
    // Generate a unique invite link for each user
    const inviteLink = generateInviteLink();

    // Create a new user with the provided data and generated invite link
    const newUser = new User({ walletId, password, inviteLink });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Function to generate a unique invite link
function generateInviteLink() {
  // Generate a unique identifier (you can use UUID or any other method)
  const uniqueId = generateUniqueId();

  // Example: Concatenate a base URL with the unique identifier
  const baseUrl = 'http://example.com/invite/';
  const inviteLink = baseUrl + uniqueId;

  return inviteLink;
}

router.post('/signin', async (req, res) => {
  try {
    const { walletId, password } = req.body;
    const user = await User.findOne({ walletId, password });
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/transaction', async (req, res) => {
  try {
    const { walletId, amount } = req.body;
    const user = await User.findOne({ walletId });
    if (user) {
      await User.updateOne({ _id: user._id }, { $inc: { points: amount } });
      res.json({ message: 'Transaction successful' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
