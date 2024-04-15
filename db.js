const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/panora', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  walletId: String,
  password: String,
  inviteLink: String,
  commonUUID: String,
  points: Number,
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
