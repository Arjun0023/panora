// app.js
const express = require('express');
const connectDB = require('./db');
const apiRoutes = require('./api');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
