const express = require('express');
const router = express.Router();
const db = require('../config/db');
const path = require('path');
const upload = require('../middlewares/uploadMiddleware'); // ✅ This handles multer setup

// POST: Create Farmer Profile
router.post('/', upload.single('profile_image'), (req, res) => {
  const {
    user_id,
    location,
    last_login,
    farm_size,
    farming_method,
    primary_crops,
   
  } = req.body;

  const account_created = new Date().toISOString().slice(0, 10);
  const profile_image = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO farmer_profiles 
    (user_id, location, account_created, last_login, farm_size, farming_method, primary_crops, profile_image )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    user_id, // This is user_id in your DB
    location,
    account_created,
    last_login,
    farm_size,
    farming_method,
    primary_crops,
    profile_image,
    
  ], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Farmer profile created successfully' });
  });
});

// PUT: Update Farmer Profile
router.put('/:user_id', upload.single('profile_image'), (req, res) => {
  const user_id = req.params.user_id;
  const {
    
    location,
    last_login,
    farm_size,
    farming_method,
    primary_crops
  } = req.body;

  const profile_image = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    UPDATE farmer_profiles SET
     location = ?, last_login = ?, farm_size = ?, 
      farming_method = ?, primary_crops = ?, profile_image = ?
    WHERE user_id = ?
  `;

  db.query(sql, [
    
    location,
    last_login,
    farm_size,
    farming_method,
    primary_crops,
    profile_image,
    user_id
  ], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Farmer profile updated successfully' });
  });
});


// GET: Fetch profile by user_id
router.get('/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  const sql = `
    SELECT u.name, u.email, u.role,
           fp.location, fp.account_created, fp.last_login,
           fp.farm_size, fp.farming_method, fp.primary_crops,
           fp.profile_image
    FROM users u
    JOIN farmer_profiles fp ON u.id = fp.user_id
    WHERE u.id = ?
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Profile not found' });

    const profile = results[0];
    profile.profile_image_url = profile.profile_image
      ? `http://localhost:5002${profile.profile_image}`
      : null;

    res.json(profile);
  });
});

module.exports = router;
