const express = require("express");
const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const router = express.Router();

// GET all products
router.get("/", getProducts);

// GET a single product by ID
router.get("/:id", getProductById);

// POST a new product
router.post("/", addProduct);

// PUT (update) a product by ID
router.put("/:id", updateProduct);

// DELETE a product by ID
router.delete("/:id", deleteProduct);

module.exports = router;
