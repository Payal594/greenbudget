const db = require("../config/db");

exports.createInvoice = (req, res) => {
  const { user_id, items, total_price } = req.body;

  if (!user_id || !items || !total_price) {
    return res.status(400).json({ error: "Missing data to create invoice" });
  }

  const query = "INSERT INTO invoices (user_id, items, total_price) VALUES (?, ?, ?)";
  db.query(query, [user_id, JSON.stringify(items), total_price], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    // ✅ Optionally clear cart after invoice
    const deleteQuery = "DELETE FROM cart WHERE user_id = ?";
    db.query(deleteQuery, [user_id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });

      res.status(201).json({ message: "Invoice created", invoice_id: result.insertId });
    });
  });
};
