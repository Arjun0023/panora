// db.js
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/referral_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// Define User schema
const userSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  password: String,
  inviteLink: String,
  points: { type: Number, default: 0 },
});

// Define User model
const User = mongoose.model('User', userSchema);

module.exports = { db, User };
