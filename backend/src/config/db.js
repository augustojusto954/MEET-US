// backend/src/config/db.js
const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/meetus';
  try {
    console.log(`[Database] Attempting connection to MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    isConnected = true;
    global.__USE_MONGOOSE__ = true;
    console.log('[Database] Connected to MongoDB successfully.');
  } catch (err) {
    console.warn(`[Database] Local MongoDB server not reachable (${err.message}).`);
    console.log('[Database] Activating high-performance persistent Document Engine (.data/)...');
    global.__USE_MONGOOSE__ = false;
  }
}

function getIsConnected() {
  return isConnected;
}

module.exports = { connectDB, getIsConnected };