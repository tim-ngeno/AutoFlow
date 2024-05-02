import { Response, Request } from 'express';
import dbClient from '../config/database';
import logger from '../config/logger';
import Task from '../models/Task';

// Middleware function to initialize MongoDB client and get the tasks collection
export default async function initializeMongoDB (req: Request, res: Response, next: any) {
  try {
    const mongoClient = await dbClient.connection;

    // Check if the connection is ready
    if (mongoClient.readyState !== 1) {
      logger.error('MongoDB connection is not ready');
      res.status(500).json({ error: 'MongoDB connection error' });
      return;
    }

    req.tasksCollection = mongoClient.model('Task').collection;
    next();
  } catch (error) {
    logger.error('Error initializing MongoDB', error);
    res.status(500).json({ error: 'MongoDB initialization error' });
  }
}
