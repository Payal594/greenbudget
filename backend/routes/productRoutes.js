const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware"); // For image uploads
const db = require("../config/db");
const productController = require("../controllers/productController");
router.get("/seller/:seller_id", productController.getProductsBySeller);
router.get("/", productController.getProducts);

// POST - Add new product
router.post("/", upload.single("image"), (req, res) => {
  const { seller_id, name, category, price, unit, stock_quantity, description } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO products (seller_id, name, category, price, unit, stock_quantity, description, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [seller_id, name, category, price, unit, stock_quantity, description, image_url],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: "Product added successfully", productId: result.insertId });
    }
  );
});

// DELETE - Remove a product by ID
router.delete("/:id", (req, res) => {
  const productId = req.params.id;

  const sql = "DELETE FROM products WHERE id = ?";

  db.query(sql, [productId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  });
});

module.exports = router;
