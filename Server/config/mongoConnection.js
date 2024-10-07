import { MongoClient } from 'mongodb';
import { mongoConfig } from './settings.js';

let _connection = undefined;
let _db = undefined;

const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = _connection.db(mongoConfig.database);
  }

  return _db;
};

const closeConnection = async () => {
  await _connection.close();
};

// const checkConnection = async () => {
//   try {
//     const db = await dbConnection();
//     const admin = db.admin();
//     const info = await admin.serverStatus();
//     return info;
//   } catch (error) {
//     throw new Error('Unable to connect to the database: ' + error.message);
//   }
// };

export { dbConnection, closeConnection, /*checkConnection*/ };