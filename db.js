// db.js

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/crypto_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('MongoDB connection error:', error));

const userSchema = new mongoose.Schema({
  crypto_wallet_id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 }
});

const inviteLinkSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  uses_remaining: { type: Number, default: 1 },
  inviter_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const User = mongoose.model('User', userSchema);
const InviteLink = mongoose.model('InviteLink', inviteLinkSchema);

module.exports = {
  User,
  InviteLink
};
