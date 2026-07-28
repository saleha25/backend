const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  username: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },

  picture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = User;