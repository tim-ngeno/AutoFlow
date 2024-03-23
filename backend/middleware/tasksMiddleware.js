import dbClient from '../config/database.js';

// Middleware function to initialize MongoDB client and get the tasks collection
export default async function initializeMongoDB(req, res, next) {
  try {
    const mongoClient = await dbClient.getMongoClient();
    req.tasksCollection = await mongoClient.db().collection('tasks');
    next();
  } catch (error) {
    console.error('Error initializing MongoDB', error);
    res.status(500).json({ error: 'MongoDB initialization error' });
  }
}
