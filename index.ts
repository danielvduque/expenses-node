import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
const app = express();

// Environment
const dotenv = require('dotenv');
dotenv.config();

// Support post requests - json 
app.use(bodyParser.json());
app.use(cors());

// mongoDB
const dbName = process.env.DBNAME;
mongoose.set('strictQuery', false);
try {
  mongoose.connect(process.env.MONGODB_URI, {});
}
catch (error) {
  console.log(error);
}
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
  console.log('Connected successfully to database: ', dbName);
  app.set('trust proxy', true); // Google app engine 
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Expenses test API listening at ${port} port`);
  });

  app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send('Health ok.');
  });

  const routes = require('./routes/routes');
  app.use('/', routes);

  app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({
      error: `page ${req.originalUrl} not found`,
      status: 404
    });
  });
});

export default app;