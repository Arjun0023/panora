// api.js
const express = require('express');
const router = express.Router();
const { UserModel } = require('./db');

router.post('/signup', async (req, res) => {
  try {
    const { id, password, inviteLink } = req.body;
    let newUser;

    if (inviteLink) {
      // Check if inviteLink exists
      const inviter = await UserModel.findOne({ inviteLink });
      if (inviter) {
        // If inviteLink exists, create new user and add points to both inviter and new user
        newUser = await UserModel.create({ id, password, inviteLink });
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
      // If no inviteLink provided, simply create new user
      newUser = await UserModel.create({ id, password });
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
    res.status(401).json({ error: error.message });
  }
});

router.post('/transaction', async (req, res) => {
  try {
    const { id, points } = req.body;
    const user = await UserModel.findOneAndUpdate(
      { id },
      { $inc: { points } },
      { new: true }
    );
    if (!user) throw new Error('User not found');
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
