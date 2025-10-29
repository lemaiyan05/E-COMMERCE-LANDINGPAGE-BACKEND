// config/firebase.js
const admin = require("firebase-admin");
require("dotenv").config();

// ✅ Check if already initialized
if (!admin.apps.length) {
  // Use environment variable (instead of local JSON file)
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// ✅ Firestore instance
const db = admin.firestore();

module.exports = { admin, db };
