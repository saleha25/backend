const { body, validationResult } = require("express-validator");

// Validation rules for creating/updating a user
const validateUser = [
  body("googleId")
    .notEmpty()
    .withMessage("Google ID is required."),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long."),

  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address."),

  body("picture")
    .optional()
    .isURL()
    .withMessage("Picture must be a valid URL."),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    next();
  },
];

module.exports = validateUser;