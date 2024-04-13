// db.js

const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite' // You can change the file name and path as needed
});

// Define User model
const User = sequelize.define('User', {
  crypto_wallet_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  balance: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
});

// Define InviteLink model
const InviteLink = sequelize.define('InviteLink', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  uses_remaining: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
});

// Define associations
User.belongsTo(InviteLink);
InviteLink.hasMany(User);

module.exports = {
  sequelize,
  User,
  InviteLink
};
