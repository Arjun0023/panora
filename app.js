// app.js
const express = require('express');
const bodyParser = require('body-parser');
const { db } = require('./db');
const apiRouter = require('./api');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Mount the API router
app.use('/api', apiRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
