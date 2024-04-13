// app.js

const express = require('express');
const apiRouter = require('./api');

const app = express();

// Middleware
app.use(express.json());

// Mount API routes
app.use('/api', apiRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
