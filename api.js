// api.js
const express = require('express');
const router = express.Router();
const { UserModel } = require('./db');

// Function to generate a random invite link
const generateInviteLink = () => {
  return Math.random().toString(36).substring(2, 10); // Generate a random alphanumeric string
};

router.post('/signup', async (req, res) => {
  try {
    const { id, password, inviteLink } = req.body;
    let newUser;

    if (inviteLink) {
      // Check if inviteLink exists
      const inviter = await UserModel.findOne({ inviteLink });
      if (inviter) {
        const commonId = Math.random().toString(36).substring(2, 10); // Generate common ID
        newUser = await UserModel.create({ id, password, commonId });
        await UserModel.updateOne(
          { _id: inviter._id },
          { $inc: { points: 5 } }
        );
        await UserModel.updateOne(
          { _id: newUser._id },
          { $inc: { points: 5 } }
        );
      } else {
        throw new Error('Invalid invite link');
      }
    } else {
      // Generate invite link for new user
      const generatedInviteLink = generateInviteLink();
      newUser = await UserModel.create({ id, password, inviteLink: generatedInviteLink });
    }

    res.status(201).json(newUser);
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
    res.status(401).json({ error: error.message });const express = require('express');
    const User = require('./db');
    
    const router = express.Router();
    
    // Signup endpoint
    router.post('/signup', async (req, res) => {
      try {
        const { id, pass, inviteLink } = req.body;
        
        // Check if invite link exists
        const inviter = await User.findOne({ uniqueInviteLink: inviteLink });
        if (!inviter) {
          return res.status(400).json({ message: 'Invalid invite link' });
        }
        
        // Generate common invite link
        const commonInviteLink = Math.random().toString(36).substring(7);
    
        // Create new user
        const newUser = new User({
          id,
          pass,
          uniqueInviteLink: inviteLink,
          commonInviteLink,
        });
        await newUser.save();
        
        return res.status(201).json({ message: 'User created successfully', newUser });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });
    
    // Transaction endpoint
    router.post('/transaction', async (req, res) => {
      try {
        const { userId, commonId, amount } = req.body;
        
        // Update points for users with commonId
        await User.updateMany({ commonInviteLink: commonId }, { $inc: { points: 5 } });
        
        return res.status(200).json({ message: 'Transaction successful' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });
    
    module.exports = router;
    
  }
});

router.post('/transaction', async (req, res) => {
  try {
    const { commonId, points } = req.body;
    const users = await UserModel.find({ commonId });
    if (!users || users.length !== 2) throw new Error('Invalid common ID');

    // Increment points for both users
    await Promise.all(users.map(user =>
      UserModel.updateOne({ _id: user._id }, { $inc: { points } })
    ));

    res.status(200).json({ message: 'Transaction completed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
