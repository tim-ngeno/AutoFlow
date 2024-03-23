import { MongoClient } from 'mongodb';
import 'dotenv/config';

class DBClient {
  constructor () {
    const port = process.env.DB_PORT || '27017';
    const host = process.env.DB_HOST || '127.0.0.1';
    const database = process.env.DB_NAME || 'AutoFlow';

    // Create the connection URI
    const mongoURI = `mongodb://${host}:${port}/${database}`;

    // Create client connection
    this.client = new MongoClient(mongoURI);

    // Handle connection to mongodb
    this.client.connect((err) => {
      if (err) {
	      console.error('Mongodb connection error:', err);
      } else {
        console.log('MongoDB connection success...');
      }
    });
  }

  // Get this mongoDB client instance
  async getMongoClient () {
    return await this.client;
  }

  // Close the mongoDB connection
  close () {
    this.client.close();
    console.log('..disconnected from server');
  }
}

const dbClient = new DBClient();
export default dbClient;
