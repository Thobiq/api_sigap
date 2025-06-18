const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

const serviceAccount = require(path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_KEY));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

console.log('firebase admin SDK success');
module.exports = admin;