import dotenv from "dotenv";
dotenv.config();

export const mongoConfig = {
  serverUrl: process.env.DB_URL,
  database: process.env.DB_NAME,
};