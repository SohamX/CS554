import express from 'express';
import cors from 'cors';
const app = express();
import configRoutes from './routes/index.js';
//import { checkConnection } from './config/mongoConnection.js';

app.use(cors());
app.use(express.json());

configRoutes(app);

// const checkDbConnection = async () => {
//   try {
//     const status = await checkConnection();
//     console.log('Connected to MongoDB Atlas:', status);
//   } catch (error) {
//     console.error('Connection failed:', error);
//   }
// };

app.listen(3000, () => {
  //checkDbConnection();
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});