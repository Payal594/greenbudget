const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middlewares/uploadMiddleware');

// POST: Create seller profile
router.post('/', upload.single('profile_image'), (req, res) => {
  const { user_id,name,contact_number, address, bio } = req.body;
  const profile_image = req.file ? `/uploads/${req.file.filename}` : null;
  const created_at = new Date().toISOString().slice(0, 10);

  const sql = `
    INSERT INTO seller_profiles (user_id,name,contact_number, address, bio, profile_image, created_at)
    VALUES (?, ?, ?, ?, ?,?,?)
  `;

  db.query(sql, [user_id,name,contact_number, address, bio, profile_image, created_at], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Seller profile created successfully' });
  });
});

// GET: Get seller profile by user_id
router.get('/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  const sql = `
    SELECT u.name, u.email, u.role,
           sp.contact_number,sp.address, sp.bio, sp.profile_image, sp.created_at
    FROM users u
    JOIN seller_profiles sp ON u.id = sp.user_id
    WHERE u.id = ?
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Profile not found' });

    const profile = results[0];
    profile.profile_image_url = profile.profile_image ? `http://localhost:5002${profile.profile_image}` : null;

    res.json(profile);
  });
});

// PUT: Update seller profile
router.put('/:user_id', upload.single('profile_image'), (req, res) => {
  const user_id = req.params.user_id;
  const { name,contact_number,address, bio } = req.body;
  const profile_image = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    UPDATE seller_profiles SET name=?,contact_number=?,address = ?, bio = ?, profile_image = ?
    WHERE user_id = ?
  `;

  db.query(sql, [name,contact_number,address, bio, profile_image, user_id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Seller profile updated successfully' });
  });
});

module.exports = router;
