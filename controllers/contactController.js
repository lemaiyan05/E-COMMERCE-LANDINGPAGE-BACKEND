// controllers/contactController.js
const { db } = require("../config/firebase.js");

// Save a new message
const sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }

    const newMessage = {
      name,
      email,
      message,
      createdAt: new Date(),
    };

    const docRef = await db.collection("contacts").add(newMessage);

    res.status(201).json({
      success: true,
      id: docRef.id,
      msg: "Message saved in Firebase!",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get all messages
const getMessages = async (req, res) => {
  try {
    const snapshot = await db.collection("contacts").orderBy("createdAt", "desc").get();

    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Delete a message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection("contacts").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ success: false, msg: "Message not found" });
    }

    await docRef.delete();
    res.status(200).json({ success: true, msg: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// ✅ Export as CommonJS
module.exports = { sendMessage, getMessages, deleteMessage };
