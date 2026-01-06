// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await prisma.user.findUnique({
      where: { username: username }
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 2. Validate Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3. Generate Token
    const token = jwt.sign(
      { userId: user.id, department: user.department, role: user.role },
      process.env.JWT_SECRET || "super_secret_key",
      { expiresIn: '8h' }
    );

    res.json({
      message: "Login successful",
      token,
      department: user.department,
      username: user.username
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { login };