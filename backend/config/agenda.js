import 'dotenv/config';
import Agenda from 'agenda';
import logger from '../config/logger.js';

const host = process.env.DB_HOST || '127.0.0.1';
const port = process.env.DB_PORT || '27017';
const db = process.env.DB_NAME || 'AutoFlow';
const mongoURI = `mongodb://${host}:${port}/${db}`;

const agenda = new Agenda(
  { db: { address: mongoURI, collection: 'agendaJobs' } }
);

agenda.define('data', async (job) => {
  logger.info('Sanity check from AgendaJs:', new Date());
});

agenda.on('error', (err) => {
  console.error('Error with agenda:', err);
});

export default agenda;
