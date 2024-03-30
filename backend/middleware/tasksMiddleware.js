import dbClient from '../config/database.js';

// Middleware function to initialize MongoDB client and get the tasks collection
export default async function initializeMongoDB (req, res, next) {
  try {
    const mongoClient = await dbClient.connection;

    // Check if the connection is ready
    if (mongoClient.readyState !== 1) {
      console.error('MongoDB connection is not ready');
      res.status(500).json({ error: 'MongoDB connection error' });
      return;
    }

    req.tasksCollection = mongoClient.model('Task').collection;
    next();
  } catch (error) {
    console.error('Error initializing MongoDB', error);
    res.status(500).json({ error: 'MongoDB initialization error' });
  }
}
