// @ts-nocheck
import { expect } from 'chai';
import scheduleJobs from '../backend/controllers/jobController.js';
import Task from '../backend/models/Task.js';
import { initialize } from './setup.js';
const RECIPIENT = process.env.RECIPIENT_ADDRESS;

// Before running any tests, initialize the database and other configurations
before(async () => {
  await initialize();
});

describe('Scheduler', () => {
  describe('Database Backup Scheduled Task', () => {
    it('should schedule database backup task correctly', async () => {
      // Create a mock database backup task
      const task = await Task.create({
        task: 'Database Backup Test-Jobs',
        type: 'Database Backup',
        schedule: '5 seconds',
        taskData: { dbName: 'Jobs', compressionType: 'gzip' }
      });

      // Schedule the task
      await scheduleJobs();

      // Retrieve the scheduled task from the database
      const scheduledTask = await Task.findOne(
        { task: 'Database Backup Test-Jobs' }
      );

      // Assertion: Verify that the task is scheduled correctly
      expect(scheduledTask).to.exist;
      expect(scheduledTask.type).to.equal('Database Backup');
      expect(scheduledTask.schedule).to.equal('5 seconds');
    });
  });

  describe('Database Backup Scheduled Task - Non-existent DB', () => {
    it('should schedule database backup task correctly', async () => {
      // Create a mock database backup task
      const task = await Task.create({
        task: 'Database Backup Test-Mock',
        type: 'Database Backup',
        schedule: '5 seconds',
        taskData: { dbName: 'MockDB', compressionType: 'gzip' }
      });

      // Schedule the task
      await scheduleJobs();

      // Retrieve the scheduled task from the database
      const scheduledTask = await Task.findOne(
        { task: 'Database Backup Test-Mock' }
      );

      // Assertion: Verify that the task is scheduled correctly
      expect(scheduledTask).to.exist;
      expect(scheduledTask.type).to.equal('Database Backup');
      expect(scheduledTask.schedule).to.equal('5 seconds');
    });
  });

  describe('File Transfer Scheduled Task', () => {
    it('should schedule file transfer task correctly', async () => {
      // Create a mock file transfer task
      const task = await Task.create({
        task: 'File Transfer Job',
        type: 'File Transfer',
        schedule: '10 seconds',
        taskData: {
	  source: '/home/tim/AutoFlow/README.md',
	  destination: '/home/tim/'
        }
      });

      // Schedule the task
      await scheduleJobs();

      // Retrieve the scheduled task from the database
      const scheduledTask = await Task.findOne({ task: 'File Transfer Job' });

      // Assertion: Verify that the task is scheduled correctly
      expect(scheduledTask).to.exist;
      expect(scheduledTask.type).to.equal('File Transfer');
      expect(scheduledTask.schedule).to.equal('10 seconds');
    });
  });

  describe('Notification Alert Scheduled Task', () => {
    it('should schedule notification alert task correctly', async () => {
      // Create a mock notification alert task
      const task = await Task.create({
        task: 'Notification Alert Job',
        type: 'Notification Alert',
        schedule: '15 seconds',
        taskData: {
	  recipient: RECIPIENT,
	  subject: 'Test Subject',
	  text: 'Test Message'
        }
      });

      // Schedule the task
      await scheduleJobs();

      // Retrieve the scheduled task from the database
      const scheduledTask = await Task.findOne({ task: 'Notification Alert Job' });

      // Assertion: Verify that the task is scheduled correctly
      expect(scheduledTask).to.exist;
      expect(scheduledTask.type).to.equal('Notification Alert');
      expect(scheduledTask.schedule).to.equal('15 seconds');
    });
  });

  describe('Invalid Task Type', () => {
    it('should handle invalid task type gracefully', async () => {
      // Create a mock task with an invalid type
      const task = new Task({
        task: 'Invalid Task',
        type: 'Invalid Type',
        schedule: '20 seconds',
        taskData: {}
      });

      // Schedule the task
      await scheduleJobs();

      // Assertion: Verify that the task is not scheduled
      const scheduledTask = await Task.findOne({ task: 'Invalid Task' });
      expect(scheduledTask).to.not.exist;
    });
  });

  describe('Periodic Task Scheduling', () => {
    it('should schedule periodic task correctly', async () => {
      // Create a mock periodic task
      const task = await Task.create({
        task: 'Periodic Task',
        type: 'Database Backup',
        schedule: 'every 1 hour',
        taskData: { dbName: 'MockDB', compressionType: 'gzip' }
      });

      // Schedule the task
      await scheduleJobs();

      // Assertion: Verify that the task is scheduled correctly
      const scheduledTask = await Task.findOne({ task: 'Periodic Task' });
      expect(scheduledTask).to.exist;
      expect(scheduledTask.type).to.equal('Database Backup');
      expect(scheduledTask.schedule).to.equal('every 1 hour');
    });
  });
});
