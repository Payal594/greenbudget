
const express = require('express');
const router = express.Router();
const db = require('../config/db');

const budgetController = require('../controllers/budgetController');

router.post('/add', budgetController.addBudgetEntry);
router.get('/expenses', budgetController.getExpenses);
router.get('/summary', budgetController.getSummary);
router.delete('/delete/:id', budgetController.deleteEntry);
// routes/budgetRoutes.js
router.get("/expenses-by-category/:farmer_id", (req, res) => {
    const farmerId = req.params.farmer_id;
    const query = `
      SELECT category, SUM(amount) AS total
      FROM budget
      WHERE type = 'expense' AND farmer_id = ?
      GROUP BY category
    `;
    db.query(query, [farmerId], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  });
  router.get("/monthly-expenses/:farmer_id", (req, res) => {
    const farmerId = req.params.farmer_id;
    const query = `
      SELECT DATE_FORMAT(date, '%Y-%m') AS month, SUM(amount) AS total
      FROM budget
      WHERE type = 'expense' AND farmer_id = ?
      GROUP BY month
      ORDER BY month
    `;
    db.query(query, [farmerId], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  });
    

module.exports = router;
