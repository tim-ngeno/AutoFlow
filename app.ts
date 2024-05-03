import scheduleJobs from './backend/controllers/jobController.js';
import authRoutes from './backend/routes/authRoutes.js';
import taskRoutes from './backend/routes/taskRoutes.js';
import dbClient from './backend/config/database.js';
import agenda from './backend/config/agenda.js';
import logger from './backend/config/logger.js';
import Task from './backend/models/Task.js';
import inquirer from 'inquirer';
import express from 'express';
import 'dotenv/config';

const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;
const app: express.Application = express();

app.use(express.json());

app.use(authRoutes);
app.use('/api', taskRoutes);

// Define interfaces for task details
interface TaskDetails {
  task: string;
  type: 'Database Backup' | 'File Transfer' | 'Notification Alert';
  schedule: string;
}

// Prompt for task details
async function promptForTaskDetails(): Promise<TaskDetails> {
  const questions = [
  {
    type: 'input',
    name: 'task',
    message: 'Enter task name:\n'
  },
  {
    type: 'list',
    name: 'type',
    message: 'Select the task type:',
    choices: ['Database Backup', 'File Transfer', 'Notification Alert']
  },
  {
    type: 'input',
    name: 'schedule',
    message: 'Enter the task schedule (e.g. "every 1 day", "tomorrow' +
	' at noon","3 minutes"):\n'
  }
];

  const answers = await inquirer.prompt<TaskDetails>(questions);

  if (answers.type === 'File Transfer') {
    const fileTransferQuestions = [
      {
	type: 'input',
	name: 'source',
	message: 'Enter the source for file transfer:\n',
      },
      {
	type: 'input',
	name: 'destination',
	message: 'Enter the destination for file transfer:\n',
      }
    ];

    const fileTransferAnswers = await inquirer.prompt(fileTransferQuestions);
    answers.taskData = fileTransferAnswers;
  }

  return answers;
}

async function main(silentMode: boolean = false): Promise<void> {
  try {
    const taskDetails: TaskDetails = await promptForTaskDetails();
    const newTask = await Task.create(taskDetails);

    if (!silentMode) {
      logger.info('Task created:', newTask);
    }

    // Reschedule all jobs after adding a new task
    await scheduleJobs();
  } catch (err) {
      logger.error('Error:', err);
  }
}

dbClient.connection.once('open', async () => {
  logger.info('MongoDB ready to receive requests...');
  // await main(true);
  await scheduleJobs();
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}...`);
});
