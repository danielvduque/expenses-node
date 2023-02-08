const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// Environment
const dotenv = require('dotenv');
dotenv.config();

// Support post requests - json 
app.use(bodyParser.json());

// mongoDB
const dbName = process.env.DBNAME;
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
console.log("primer debug");
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('Connected successfully to database: ', dbName);

  // Google app engine 
  app.set('trust proxy', true);

  // Server
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Expenses test API listening at ${port} port`);
  });

  // Test endpoint
  app.get('/', (req, res) => {
    res.status(200).send('Health ok.');
  });

  // Routes
  const routes = require('./routes/routes');
  app.use('/', routes);

  // Catch 404 error
  app.use((req, res) => {
    res.status(404).json({
      error: `page ${req.originalUrl} not found`,
      status: 404
    });
  });

});
module.exports = app;