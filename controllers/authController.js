
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
  googleLogin,
};