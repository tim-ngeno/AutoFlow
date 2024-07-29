import mongoose from 'mongoose';
import agenda from '../backend/config/agenda';
import dbClient from '../backend/config/database';

// Define initialization function
export async function initialize () {
  // Connect to the database
  await dbClient.connection;

  // Start agenda
  await agenda.start();

  // Return a promise that resolves once everything is initialized
  return Promise.resolve();
}

export async function closeDatabase() {
  // Close the mongodb connection using the dbClient
  await dbClient.close();
}

export async function stopAgenda() {
  // Stop the agenda scheduler
  await agenda.stop();
}
