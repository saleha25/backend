const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

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

    // Generate our own JWT
    const token = jwt.sign(
      {
        googleId: user.googleId,
        email: user.email,
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