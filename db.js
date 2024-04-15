// db.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  password: String,
  inviteLink: { type: String, unique: true, sparse: true },
  points: { type: Number, default: 0 },
});

const UserModel = mongoose.model('User', userSchema);

module.exports = { UserModel };
