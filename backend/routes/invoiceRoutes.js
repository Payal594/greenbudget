const express = require("express");
const router = express.Router();
const { createInvoice } = require("../controllers/invoiceController");

router.post("/create", createInvoice);

module.exports = router;
