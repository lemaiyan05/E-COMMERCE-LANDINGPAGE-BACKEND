// controllers/productController.js
const { db, admin } = require("../config/firebase"); // import both admin and db

// ✅ Get all products
const getProducts = async (req, res) => {
  try {
    const snapshot = await db.collection("products").orderBy("name", "asc").get();

    if (snapshot.empty) {
      return res.json({ success: true, products: [] });
    }

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, msg: error.message });
  }
};


// ✅ Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("products").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, msg: "Product not found" });
    }

    res.status(200).json({ success: true, product: { id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error("🔥 Error fetching product:", error.message);
    res.status(500).json({ success: false, msg: "Failed to fetch product" });
  }
};

// ✅ Add new product
const addProduct = async (req, res) => {
  try {
    const { name, desc, price, img } = req.body;

    // Basic validation
    if (!name?.trim() || !desc?.trim() || !price || !img?.trim()) {
      return res
        .status(400)
        .json({ success: false, msg: "All fields are required" });
    }

    const newProduct = {
      name: name.trim(),
      desc: desc.trim(),
      price: parseFloat(price),
      img: img.trim(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("products").add(newProduct);
    const savedProduct = await docRef.get();

    res.status(201).json({
      success: true,
      product: { id: savedProduct.id, ...savedProduct.data() },
    });
  } catch (error) {
    console.error("🔥 Error adding product:", error.message);
    res.status(500).json({ success: false, msg: "Failed to add product" });
  }
};

// ✅ Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const docRef = db.collection("products").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, msg: "Product not found" });
    }

    await docRef.update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const updatedDoc = await docRef.get();
    res.status(200).json({
      success: true,
      product: { id: updatedDoc.id, ...updatedDoc.data() },
    });
  } catch (error) {
    console.error("🔥 Error updating product:", error.message);
    res.status(500).json({ success: false, msg: "Failed to update product" });
  }
};

// ✅ Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection("products").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, msg: "Product not found" });
    }

    await docRef.delete();
    res.status(200).json({ success: true, msg: "Product deleted successfully" });
  } catch (error) {
    console.error("🔥 Error deleting product:", error.message);
    res.status(500).json({ success: false, msg: "Failed to delete product" });
  }
};

// ✅ Export all controller functions
module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
