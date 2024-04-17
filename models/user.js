// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  inviteUrl: { type: String, unique: true },
  commonUrl: { type: String },
});

module.exports = mongoose.model('User', userSchema);
