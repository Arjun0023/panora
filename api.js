// api.js
const express = require('express');
const router = express.Router();
const User = require('./models/user');

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { id, password, inviteUrl } = req.body;

    // If no invite URL is provided, create a new user without association
    if (!inviteUrl) {
      const newUser = new User({
        id,
        password,
      });

      await newUser.save();
      return res.status(201).json({ message: 'User created successfully' });
    }

    // Check if the invite URL exists
    const invitingUser = await User.findOne({ inviteUrl });

    if (!invitingUser) {
      return res.status(400).json({ message: 'Invalid invite URL' });
    }

    // Create a new user
    const newUser = new User({
      id,
      password,
      inviteUrl,
      commonUrl: invitingUser.commonUrl || inviteUrl,
    });

    // Save the new user
    await newUser.save();

    // If it's the first user, set the common URL as the invite URL
    if (!invitingUser) {
      newUser.commonUrl = inviteUrl;
      await newUser.save();
    }

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Signin endpoint
router.post('/signin', async (req, res) => {
  try {
    const { id, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ id });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
