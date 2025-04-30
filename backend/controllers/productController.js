const db = require("../config/db");
const productController = require("../controllers/productController");

exports.getProducts = (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
exports.getProductsBySeller = (req, res) => {
  const sellerId = req.params.seller_id;

  const query = "SELECT * FROM products WHERE seller_id = ?";
  db.query(query, [sellerId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.addProduct = (req, res) => {
    const { name, price, unit, category, stock_quantity, description, image_url } = req.body;
    const query = `
      INSERT INTO products (name, price, unit, category, stock_quantity, description, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [name, price, unit, category, stock_quantity, description, image_url], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Product added successfully", productId: result.insertId });
    });
  };
