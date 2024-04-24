import { config } from 'dotenv';
import _Agenda, { Job } from 'agenda';
import logger from '../config/logger.js';

// Load environment variables
config();

const Agenda = _Agenda as unknown as typeof _Agenda.default;

const host: string = process.env.DB_HOST || '127.0.0.1';
const port: string = process.env.DB_PORT || '27017';
const db: string = process.env.DB_NAME || 'AutoFlow';
const mongoURI: string = `mongodb://${host}:${port}/${db}`;

const agenda = new Agenda(
  { db: { address: mongoURI, collection: 'agendaJobs' } }
);

agenda.define('data', async (job: Job) => {
  logger.info('Sanity check from AgendaJs:', new Date());
});

agenda.on('error', (err: Error) => {
  console.error('Error with agenda:', err);
});

export default agenda;