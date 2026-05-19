/**
 * app.js
 * Configures and exports the Express application without starting the server.
 * Keeping this separate from server.js makes the API easier to test.
 */

// Import Express, which is the web framework that creates the API application.
const express = require('express');
// Import CORS so the frontend can communicate with the backend from another origin during development.
const cors = require('cors');
// Import Helmet to add safer HTTP headers automatically.
const helmet = require('helmet');
// Import rate limiting to slow down repeated requests from the same client.
const rateLimit = require('express-rate-limit');
// Import Mongo sanitization to remove dangerous MongoDB operators from user input.
const mongoSanitize = require('express-mongo-sanitize');
// Import XSS cleaning to reduce cross-site scripting risk in submitted data.
const xss = require('xss-clean');
// Import compression so API responses can be sent more efficiently.
const compression = require('compression');
// Import Morgan so requests are logged while developing.
const morgan = require('morgan');
// Import path so Express can safely serve the frontend folder.
const path = require('path');

// Create one Express application instance that routes and tests can use.
const app = express();

// Enable cross-origin requests so the frontend pages can call this API.
app.use(cors());
// Add common security headers to every response while allowing the existing frontend assets to load.
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', 'https://cdnjs.cloudflare.com'],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdnjs.cloudflare.com', 'data:'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"]
    }
  }
}));
// Limit repeated requests to reduce brute-force and spam behavior.
app.use(rateLimit({
  // This creates a 15-minute window for counting requests.
  windowMs: 15 * 60 * 1000,
  // Each IP can make 100 requests per 15-minute window.
  max: 100,
  // Use modern rate-limit response headers.
  standardHeaders: true,
  // Do not send older legacy rate-limit headers.
  legacyHeaders: false
}));
// Parse incoming JSON request bodies so controllers can read req.body.
app.use(express.json());
// Remove MongoDB query operators such as $gt or $ne from incoming user data.
app.use(mongoSanitize());
// Clean submitted text to reduce the chance of XSS payloads reaching the database.
app.use(xss());
// Compress responses to make the API more efficient.
app.use(compression());

// Morgan logs every request in development, but it is skipped during tests to keep test output clean.
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Mount authentication routes under /api/auth.
app.use('/api/auth', require('./routes/authRoutes'));
// Mount feedback routes under /api/feedback.
app.use('/api/feedback', require('./routes/feedbackRoutes'));
// Mount sustainability tip routes under /api/tips.
app.use('/api/tips', require('./routes/tipRoutes'));
// Mount food waste, reporting, and priority routes under /api/waste.
app.use('/api/waste', require('./routes/foodWasteRoutes'));

// Serve the static frontend from the public folder so the app can be tested from one local URL.
app.use(express.static(path.join(__dirname, '..', 'public')));

// This health-check route confirms that the backend is running.
app.get('/', (req, res) => {
  res.send('SNHU Food Waste Tracker Backend is running!');
});

// This is the final fallback error handler for unexpected Express errors.
app.use((err, req, res, _next) => {
  // Log the full stack trace for debugging on the server side.
  console.error('Unhandled Exception:', err.stack);
  // Send a safe generic message back to the client.
  res.status(500).json({ error: 'Internal Server Error: Something went wrong!' });
});

// Export the app so server.js can start it and tests can import it without opening a port.
module.exports = app;
