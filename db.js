const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/newPanora2', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  points: { type: Number, default: 0 },
  uniqueInviteLink: { type: String, unique: true },
  commonInviteLink: { type: String, unique: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
