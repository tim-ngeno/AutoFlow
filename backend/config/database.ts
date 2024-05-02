import 'dotenv/config';
import mongoose from 'mongoose';
import logger from '../config/logger';

interface DBConnectionOptions {
  port?: string;
  host?: string;
  database?: string;
}

interface DBClientInterface {
  connection: mongoose.Connection;
  close(): void
}

class DBClient implements DBClientInterface {
  connection: mongoose.Connection;

  constructor() {
    const options: DBConnectionOptions = {
      port: process.env.DB_PORT || '27017',
      host: process.env.DB_HOST || '127.0.0.1',
      database: process.env.DB_NAME || 'AutoFlow',
    };

    // Create the connection URI
    const mongoURI = `mongodb://${options.host}:${options.port}/${options.database}`;

    // Connect to mongoDB server
    mongoose.connect(mongoURI);
    this.connection = mongoose.connection;
    this.connection.on('connected', () => {
      logger.info('MongoDB connected');
    });
    this.connection.on('error', (error) => {
      console.error('Mongo DB connection error', error);
    });
  }

  // Close the mongoDB connection
  close() {
    this.connection.close();
    logger.info('MongoDB connection close');
  }
}

const dbClient = new DBClient();
export default dbClient;
