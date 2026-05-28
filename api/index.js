/**
 * Vercel serverless entry point.
 * Connects to MongoDB (cached across warm invocations) and forwards requests to Express.
 */
const connectDB = require('../snhu-foodwaste-backend/config/db');
const app = require('../snhu-foodwaste-backend/app');

let dbReady = false;

async function ensureDb() {
  if (!dbReady) {
    await connectDB();
    dbReady = true;
  }
}

module.exports = async (req, res) => {
  await ensureDb();
  return app(req, res);
};
