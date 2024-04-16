const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  password: String,
  inviteUrl: String,
  commonUrl: String,
  points: { type: Number, default: 0 } // Adding points field
});

const User = mongoose.model('User', userSchema);

module.exports = User;
