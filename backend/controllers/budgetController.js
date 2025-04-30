// backend/controllers/budgetController.js
const db = require('../config/db');

// Add entry (income or expense)
exports.addBudgetEntry = (req, res) => {
  const {farmer_id, type, title, amount, category, date } = req.body;
  const query = 'INSERT INTO budget (farmer_id, type, title, amount, category, date) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [farmer_id,type, title, amount, category, date], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ message: 'Entry added successfully' });
  });
};

// Get all expenses



// This fetches all expenses for ALL users
exports.getExpenses = (req, res) => {
  const farmerId = req.query.farmer_id;
  const query = 'SELECT * FROM budget WHERE type = "expense" AND farmer_id = ? ORDER BY date DESC';
  db.query(query, [farmerId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};


// 🚨 This sums ALL income/expenses, not user-specific
exports.getSummary = (req, res) => {
  const farmerId = req.query.farmer_id;
  const query = `
    SELECT
      (SELECT IFNULL(SUM(amount), 0) FROM budget WHERE type = 'income' AND farmer_id = ?) AS totalIncome,
      (SELECT IFNULL(SUM(amount), 0) FROM budget WHERE type = 'expense' AND farmer_id = ?) AS totalExpenses
  `;
  db.query(query, [farmerId, farmerId], (err, results) => {
    if (err) return res.status(500).send(err);
    const summary = results[0];
    summary.remaining = summary.totalIncome - summary.totalExpenses;
    res.json(summary);
  });
};




// Delete an expense
exports.deleteEntry = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM budget WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Entry deleted successfully' });
  });
};
