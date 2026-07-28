
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const User = require("./models/User");
const userRoutes = require("./routes/userRoutes");
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Discord Clone Backend Running ",
  });
});
sequelize
  .authenticate()
  .then(async () => {
    console.log("✅ PostgreSQL Connected Successfully!");

    await sequelize.sync({ alter: true });

    console.log("✅ Database Synced Successfully!");
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed:", err.message);
  });
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});