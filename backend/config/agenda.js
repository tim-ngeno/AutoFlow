import Agenda from 'agenda';
import 'dotenv/config';

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const db = process.env.DB_NAME;

const mongoURI = `mongodb://${host}:${port}/${db}`;

const agenda = new Agenda(
  { db: { address: mongoURI, collection: 'agendaJobs' } }
);

agenda.define('data', async (job) => {
  console.log('Logging a message from agendaJS:', new Date());
});

agenda.start();

agenda.on('error', (err) => {
  console.error('Error with agenda:', err);
});

export default agenda;
