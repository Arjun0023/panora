const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  inviteUrl: {
    type: String,
    unique: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  points: {
    type: Number,
    default: 0
  }
});


userSchema.pre('save', function(next) {
  if (!this.inviteUrl) {
    this.inviteUrl = uuidv4(); 
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;