const db = require("../config/db");

exports.addToCart = (req, res) => {
  const { user_id, product_id, quantity = 1 } = req.body;
  console.log("Cart request:", req.body); // ✅ Add this log

  if (!user_id || !product_id) {
    return res.status(400).json({ error: "Missing user_id or product_id" });
  }
  // 1. Fetch product details
  const productQuery = "SELECT name, price FROM products WHERE id = ?";
  db.query(productQuery, [product_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching product" });
    if (results.length === 0) return res.status(404).json({ error: "Product not found" });

    const product = results[0];
    const total_price = parseFloat(product.price) * quantity;

   
    

    // 2. Insert into cart
    const insertQuery = `
      INSERT INTO cart (user_id, product_id, name, price, quantity, total_price)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      insertQuery,
      [user_id, product_id, product.name, product.price, quantity, total_price],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Product added to cart successfully" });
      }
    );
  });
};
exports.getCartForUser = (req, res) => {
  const { user_id } = req.params;

  const query = "SELECT * FROM cart WHERE user_id = ?";
  db.query(query, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
