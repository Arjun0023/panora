const express = require('express');
const router = express.Router();
const User = require('./User');

router.post('/signup', async (req, res) => {
  try {
    const { id, password, inviteUrl } = req.body;
    const user = new User({ id, password, inviteUrl });

    // Find the user who sent the invite
    const inviter = await User.findOne({ commonUrl: inviteUrl });

    if (inviter) {
      user.commonUrl = inviteUrl; // Set common URL same as invite URL sender
      inviter.points += 5; // Award 5 points to the invite link sender
      await inviter.save();
      user.points += 5; // Award 5 points to the new user
    }

    await user.save();
    res.status(201).send('User created successfully');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { id, password } = req.body;
    const user = await User.findOne({ id, password });

    if (user) {
      res.status(200).send('Sign in successful');
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});
router.post('/transaction', async (req, res) => {
  try {
    const { userId, amount } = req.body;

    // Find the user performing the transaction
    const user = await User.findById(userId);

    if (user) {
      // Increment user's points
      user.points += amount;
      await user.save();

      // If there's a common URL (invited by someone), find and award points to the inviter
      if (user.commonUrl) {
        // Find the inviter (user who sent the invite link)
        const inviter = await User.findOne({ commonUrl: user.commonUrl });
        if (inviter) {
          // Increment inviter's points
          inviter.points += amount;
          await inviter.save();
        }
      }

      res.status(200).send('Transaction successful');
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
