const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');

exports.register = (req, res) => {
  const { name, email, password,role } = req.body;

  findUserByEmail(email, (err, results) => {
    if (results.length > 0) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = bcrypt.hashSync(password, 10);
    createUser(name, email, hashedPassword,role, (err) => {
      if (err) {
        console.error("Database Error:", err); 
        return res.status(500).json({ message: "DB error" });
      }
      res.status(201).json({ message: "User registered" });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  findUserByEmail(email, (err, results) => {
    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role, // ✅ Make sure this exists in your database
        name: user.name
      }
    
  });
});
};
