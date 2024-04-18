const express = require('express');
const User = require('./models/User');
const Transaction = require('./models/Transaction');

const router = express.Router();


router.post('/signup', async (req, res) => {
  try {
    const { id, password, inviteUrl } = req.body;


    let referredByUser = null;
    if (inviteUrl) {
      referredByUser = await User.findOne({ inviteUrl });
      if (!referredByUser) {
        return res.status(404).json({ message: 'Referring user not found' });
      }
    }


    const user = new User({ id, password });

    if (referredByUser) {
      user.referredBy = referredByUser._id;
    }


    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




router.post('/transaction', async (req, res) => {
  try {
    const { userId, amount, referredBy } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const transaction = new Transaction({ userId, amount });
    await transaction.save();

    const transactionPoints = 5;
    user.points += transactionPoints;
    await user.save();

    if (referredBy) {
      const referringUser = await User.findById(referredBy);
      if (referringUser) {
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
