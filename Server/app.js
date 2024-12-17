import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import configRoutes from './routes/index.js';
import setUpSocket from './socket/index.js';

const app = express();
const server = createServer(app);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

configRoutes(app);
setUpSocket(server);

server.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});