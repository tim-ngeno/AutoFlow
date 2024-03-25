import scheduleJobs from './backend/controllers/jobController.js';
import authRoutes from './backend/routes/authRoutes.js';
import taskRoutes from './backend/routes/taskRoutes.js';
import dbClient from './backend/config/database.js';
import agenda from './backend/config/agenda.js';
import Task from './backend/models/Task.js';
import inquirer from 'inquirer';
import express from 'express';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use(authRoutes);
app.use('/api', taskRoutes);

// Prompt for task details
async function promptForTaskDetails () {
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

  const answers = await inquirer.prompt(questions);
  return answers;
}

async function main () {
  try {
    const taskDetails = await promptForTaskDetails();
    const newTask = await Task.create(taskDetails);
    console.log('Task created:', newTask);

    // Reschedule all jobs after adding a new task
    await scheduleJobs();
  } catch (err) {
    console.error('Error:', err);
  }
}

dbClient.connection.once('open', async () => {
  console.log('MongoDB connection is open');
  main();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
