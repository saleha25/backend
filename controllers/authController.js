
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Account created successfully.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        picture: user.picture,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is missing.",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const user = {
      googleId: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    };
let existingUser = await User.findOne({
  where: {
    googleId: user.googleId,
  },
});
if (!existingUser) {
  existingUser = await User.create({
    googleId: user.googleId,
    name: user.name,
    email: user.email,
    picture: user.picture,
  });

  console.log("✅ New user created in database.");
} else {
  console.log("✅ Existing user logged in.");
}
    // Generate our own JWT
    const token = jwt.sign(
  {
    id: existingUser.id,
    googleId: existingUser.googleId,
    email: existingUser.email,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

    return res.status(200).json({
      message: "Login Successful",
      token,
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Invalid Google token.",
    });
  }
};

module.exports = {
    registerUser,
  googleLogin,
  loginUser,
};