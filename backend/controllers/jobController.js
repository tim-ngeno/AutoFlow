import mailService from '../services/emailService.js';
import taskHandler from '../services/taskService.js';
import agenda from '../config/agenda.js';
import logger from '../config/logger.js';
import Task from '../models/Task.js';

export default async function scheduleJobs () {
  try {
    // Retrieve all tasks in storage
    const tasks = await Task.find({});

    if (tasks.length === 0) {
      console.log('No scheduled jobs found');
      // Run a sanity check
      await agenda.schedule('now', 'data');
    }

    // Clear all existing jobs
    // await agenda.cancel();

    for (const task of tasks) {
      console.log(`Processing task: ${task.task}, Type: ${task.type},` +
		  ` Schedule: ${task.schedule}`);
      switch (task.type) {
        case 'Database Backup':
          console.log('Scheduling database backup:', task.task);
          agenda.define('dbBackup', async (job) => {
	    console.log('DataBase backup data:', job.attrs.data);
	    console.log(job.attrs.data.data.taskData);
	    const dbName = job.attrs.data.data.taskData.dbName;
	    const compressionType = job.attrs.data.data.compressionType;
	    await taskHandler.performDatabaseBackup(dbName, compressionType);
          });
          await schedulePeriod(task.schedule, 'dbBackup', task);
          break;

        case 'File Transfer':
          console.log('Scheduling file transfer:', task.task);
          agenda.define('fileTransfer', async (job) => {
	    console.log('File transfer job data:', job.attrs.data);
	    console.log(job.attrs.data.data.taskData);
	    const { source } = job.attrs.data.data.taskData;
	    const { destination } = job.attrs.data.data.taskData;
	    await taskHandler.performFileTransfer(source, destination);
          });
          await schedulePeriod(task.schedule, 'fileTransfer', task);
          break;

        case 'Notification Alert':
          console.log('Scheduling notification alert:', task.task);
          agenda.define('notificationAlert', async (job) => {
	    console.log('Notification alert data:', job.attrs.data);
	    const { recipient, subject, text } = job.attrs.data.data.taskData;
	    await mailService.sendEmail(recipient, subject, text);
	    console.log('Notification alert sent!');
          });
          await schedulePeriod(task.schedule, 'notificationAlert', task);
          break;

        default:
          console.error(`Unknown task type: ${task.type}`);
      }
    }

    // Start agenda after scheduling all jobs
    agenda.start();
  } catch (err) {
    console.error('Error scheduling jobs from database:', err);
  }
}

async function schedulePeriod (schedule, jobType, task) {
  if (schedule.includes('every')) {
    const [_, time] = schedule.split('every');
    console.log(`Scheduling ${jobType} to run every ${time}`);
    await agenda.every(time, jobType, { data: task });
  } else {
    console.log(`Scheduling ${jobType} to run once in ${schedule}`);
    await agenda.schedule(schedule, jobType, { data: task });
  }
}
