import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import { createServer } from 'http';
import configRoutes from './routes/index.js';
import setUpSocket from './socket/index.js';

dotenv.config();
const app = express();
const server = createServer(app);

const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // Replace with your allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] // Allowed HTTP methods
};

app.use(cors(corsOptions)); 
app.use(express.json());
app.use(express.urlencoded({extended: true}));

configRoutes(app);
setUpSocket(server);

server.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});