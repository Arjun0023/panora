// api.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, InviteLink } = require('./db');

const router = express.Router();

// Sign Up endpoint
router.post('/signup', async (req, res) => {
  const { crypto_wallet_id, password, invite_link } = req.body;

  try {
    // Find invite link
    const invite = await InviteLink.findOne({ where: { code: invite_link } });

    // Check if invite link is valid and has uses remaining
    if (!invite || invite.uses_remaining <= 0) {
      return res.status(400).json({ error: 'Invalid invite link or link has been used' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and link to invite link
    const user = await User.create({ crypto_wallet_id, password: hashedPassword });
    await invite.addUser(user);

    // Decrement uses remaining for invite link
    await invite.decrement('uses_remaining');

    return res.status(200).json({ message: 'User signed up successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign In endpoint
router.post('/signin', async (req, res) => {
  const { crypto_wallet_id, password } = req.body;

  try {
    // Find user by crypto wallet ID
    const user = await User.findOne({ where: { crypto_wallet_id } });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Transaction endpoint
router.post('/transaction', async (req, res) => {
  // Implementation for user transaction
});

module.exports = router;
