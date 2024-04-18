const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const apiRouter = require('./api');

const app = express();

app.use(bodyParser.json());

// Use API routes
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
