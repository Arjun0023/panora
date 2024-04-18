const express = require('express');
const User = require('./models/User');
const Transaction = require('./models/Transaction');

const router = express.Router();

// User signup route
router.post('/signup', async (req, res) => {
  try {
    const { id, password, inviteUrl } = req.body;

    // Check if the user was referred by someone
    let referredByUser = null;
    if (inviteUrl) {
      referredByUser = await User.findOne({ inviteUrl });
      if (!referredByUser) {
        return res.status(404).json({ message: 'Referring user not found' });
      }
    }

    // Create user
    const user = new User({ id, password });

    // Set referredBy if user was referred
    if (referredByUser) {
      user.referredBy = referredByUser._id;
    }

    // Save user to database
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Transaction route
router.post('/transaction', async (req, res) => {
  try {
    const { userId, amount, referredBy } = req.body;

    // Find user making the transaction
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Record transaction
    const transaction = new Transaction({ userId, amount });
    await transaction.save();

    // Increment user points for the transaction
    const transactionPoints = 5;
    user.points += transactionPoints;
    await user.save();

    // Check if referredBy is provided and valid
    if (referredBy) {
      const referringUser = await User.findById(referredBy);
      if (referringUser) {
        // Increment points for the referring user
        referringUser.points += transactionPoints;
        await referringUser.save();
      }
    }

    res.status(201).json({ message: 'Transaction recorded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
module.exports = router;

module.exports = router;
