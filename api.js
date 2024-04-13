const express = require('express');
const bodyParser = require('body-parser');
const { User } = require('./db');

const router = express.Router();
router.use(bodyParser.json());

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, inviteLink } = req.body;

    if (inviteLink) {
      const sender = await User.findOne({ inviteLink });
      if (sender) {
        sender.points += 5;
        await sender.save();
      }
    }
    const newInviteLink = generateUniqueInviteLink();
    const newUser = new User({
      username,
      email,
      password,
      inviteLink: newInviteLink,
      points: 0
    });
    await newUser.save();

    res.status(201).json({ message: 'User signed up successfully' });
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({ error: 'An error occurred while signing up' });
  }
});

// Signin endpoint
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error signing in user:', error);
    res.status(500).json({ error: 'An error occurred while signing in' });
  }
});

function generateUniqueInviteLink() {
  const randomString = Math.random().toString(36).substring(7);
  return `http://example.com/invite/${randomString}`;
}

module.exports = router;
