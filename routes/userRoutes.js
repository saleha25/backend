const express = require("express");
const router = express.Router();
const validateUser = require("../middleware/userValidation");

// Controllers
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// Routes
router.post("/", validateUser, createUser);

router.get("/", getAllUsers);

router.get("/:id", getUserById);

router.put("/:id", validateUser, updateUser);

router.delete("/:id", deleteUser);
module.exports = router;