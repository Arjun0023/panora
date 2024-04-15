const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { User } = require('./db');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { walletId, password, inviteLink } = req.body;

    // Generate a unique invite link for each user if not provided
    const generatedInviteLink = inviteLink || generateInviteLink();

    // Check if inviteLink is provided and find the user with that invite link
    const inviter = inviteLink ? await User.findOne({ inviteLink }) : null;

    // Create a new user with the provided data and generated invite link
    const newUser = new User({ walletId, password, inviteLink: generatedInviteLink });

    // Set a common ID between users who sign up using the same invite link
    if (inviter) {
      newUser.commonId = inviter.commonId || uuidv4();
    }

    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Function to generate a unique invite link
function generateInviteLink() {
  // Generate a unique identifier using uuid
  const uniqueId = uuidv4();

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
      // Check if there's a commonId associated with the user
      if (user.commonId) {
        // Find the inviter (user with the same commonId)
        const inviter = await User.findOne({ commonId: user.commonId });
        if (inviter) {
          // Add 5 points to the user's points
          await User.updateOne({ _id: user._id }, { $inc: { points: amount } });

          // Add 5 points to the inviter's points
          await User.updateOne({ _id: inviter._id }, { $inc: { points: amount } });

          res.json({ message: 'Transaction successful' });
        } else {
          res.status(404).json({ message: 'Inviter not found' });
        }
      } else {
        // If no commonId is associated, only add points to the user's account
        await User.updateOne({ _id: user._id }, { $inc: { points: amount } });
        res.json({ message: 'Transaction successful' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
