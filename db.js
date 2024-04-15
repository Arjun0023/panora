// db.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/newPanora', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  password: String,
  commonId: String,
  points: { type: Number, default: 0 },
});

const UserModel = mongoose.model('User', userSchema);

module.exports = { UserModel };
