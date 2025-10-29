const { db } = require("../config/firebase.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Signup Controller
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, msg: "⚠️ All fields are required." });
    }

    // Check if user already exists
    const snapshot = await db.collection("users").where("email", "==", email).get();
    if (!snapshot.empty) {
      return res.status(400).json({ success: false, msg: "⚠️ User already exists. Please log in instead." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    // Save to Firestore
    const docRef = await db.collection("users").add(newUser);

    // Generate token
    const token = jwt.sign(
      { id: docRef.id, email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    // ✅ Respond to frontend
    return res.status(201).json({
      success: true,
      token,
      id: docRef.id,
      msg: "✅ Signup successful! Welcome aboard.",
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    return res.status(500).json({ success: false, msg: "❌ Server error during signup. Please try again." });
  }
};

// ✅ Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, msg: "⚠️ Email and password are required." });
    }

    const snapshot = await db.collection("users").where("email", "==", email).get();

    if (snapshot.empty) {
      return res.status(404).json({ success: false, msg: "❌ No account found with this email." });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: "❌ Invalid credentials. Try again." });
    }

    // Generate token
    const token = jwt.sign(
      { id: userDoc.id, email: user.email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      msg: "✅ Login successful!",
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ success: false, msg: "❌ Server error during login." });
  }
};

// ✅ Protected Profile Route
const profile = async (req, res) => {
  try {
    res.json({ success: true, msg: "✅ Protected route accessed.", user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = { signup, login, profile };
