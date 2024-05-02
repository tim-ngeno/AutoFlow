import mongoose from 'mongoose';
import agenda from '../backend/config/agenda.js';
import dbClient from '../backend/config/database.js';

// Define initialization function
export async function initialize () {
  // Connect to the database
  await dbClient.connection;

  // Start agenda
  await agenda.start();

  // Return a promise that resolves once everything is initialized
  return Promise.resolve();
}
