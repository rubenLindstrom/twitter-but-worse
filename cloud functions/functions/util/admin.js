const admin = require("firebase-admin");
const config = require("./config");

// Development;
// admin.initializeApp({
//   credential: admin.credential.cert(require("../../admin.json")),
//   storageBucket: config.storageBucket
// });
// Production;
admin.initializeApp();

const db = admin.firestore();

module.exports = { admin, db };
