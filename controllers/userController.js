const User = require("../models/User");

// Create User
// Create User
const createUser = async (req, res) => {
  try {
    const { googleId, name, email, picture } = req.body;

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    const user = await User.create({
      googleId,
      name,
      email,
      picture,
    });

    res.status(201).json({
      message: "User created successfully.",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Users
// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    res.status(200).json({
      message: "Users fetched successfully.",
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get User By ID
// Get User By ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.status(200).json({
      message: "User fetched successfully.",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update User
// Update User
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, picture } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    await user.update({
      name,
      email,
      picture,
    });

    res.status(200).json({
      message: "User updated successfully.",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete User
// Delete User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    await user.destroy();

    res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};