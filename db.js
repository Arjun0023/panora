const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;


const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  inviteLink: String,
  points: Number
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
