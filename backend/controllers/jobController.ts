import mailService from '../services/emailService.js';
import taskHandler from '../services/taskService.js';
import agenda from '../config/agenda.js';
import { Job } from 'agenda';
import logger from '../config/logger.js';
import Task from '../models/Task.js';

// const [ Task, TaskInterface ] = TaskModule;

export default async function scheduleJobs () {
  try {
    // Retrieve all tasks in storage
    const tasks = await Task.find({});

    if (tasks.length === 0) {
      logger.info('No scheduled jobs found');
    }

    // Clear all existing jobs
    await agenda.cancel({ force: true });

    for (const task of tasks) {
      logger.info(`Processing task: ${task.task}, Type: ${task.type},` +
		  ` Schedule: ${task.schedule}`);
      switch (task.type) {
        case 'Database Backup':
          logger.info('Scheduling database backup:', task.task);
	  // Define the agenda job for Database Backups
	  await agenda.define('dbBackup', async (job: Job) => {
	    console.log('DataBase backup data:', job.attrs.data);
	    console.log(job.attrs.data.data.taskData);
	    const dbName = job.attrs.data.data.taskData.dbName;
	    const compressionType = job.attrs.data.data.compressionType;
	    await taskHandler.performDatabaseBackup(dbName, compressionType);
          });
          await schedulePeriod(task.schedule, 'dbBackup', task.toObject());
          break;

        case 'File Transfer':
          console.log('Scheduling file transfer:', task.task);
          await agenda.define('fileTransfer', async (job: Job) => {
	    console.log('File transfer job data:', job.attrs.data);
	    console.log(job.attrs.data.data.taskData);
	    const { source } = job.attrs.data.data.taskData;
	    const { destination } = job.attrs.data.data.taskData;
	    await taskHandler.performFileTransfer(source, destination);
          });
          await schedulePeriod(task.schedule, 'fileTransfer', task.toObject());
          break;

        case 'Notification Alert':
          logger.info('Scheduling notification alert:', task.task);
          await agenda.define('notificationAlert', async (job: Job) => {
	    console.log('Notification alert data:', job.attrs.data);
	    const { recipient, subject, text } = job.attrs.data.data.taskData;
	    await mailService.sendEmail(recipient, subject, text);
	    // logger.info('Notification alert sent!');
          });
          await schedulePeriod(task.schedule, 'notificationAlert', task.toObject());
          break;

        default:
          logger.error(`Unknown task type: ${task.type}`);
      }
    }

    // Start agenda after scheduling all jobs
    agenda.start();
  } catch (err) {
    logger.error('Error scheduling jobs from database:', err);
  }
}

async function schedulePeriod (schedule: string, jobType: string, task) {
  if (schedule.includes('every')) {
    const [_, time] = schedule.split('every');
    logger.info(`Scheduling ${jobType} to run every ${time}`);
    await agenda.every(time, jobType, { data: task });
  } else {
    logger.info(`Scheduling ${jobType} to run once in ${schedule}`);
    await agenda.schedule(schedule, jobType, { data: task });
  }
}
