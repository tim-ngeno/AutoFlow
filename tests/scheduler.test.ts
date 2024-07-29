import { describe, expect, test, beforeAll, afterAll, beforeEach } from '@jest/globals';
import scheduleJobs from '../backend/controllers/jobController';
import Task from '../backend/models/Task';
import { initialize, closeDatabase, stopAgenda } from './setup';

const RECIPIENT = process.env.RECIPIENT_ADDRESS;

// Before running any tests, initialize the database and other configurations
beforeAll(async () => {
  await initialize();
});

// Clear the tasks collection before each test
beforeEach(async () => {
  await Task.deleteMany({});
})

// Close the database connection after all tests and cleanup
afterAll(async () => {
  await Task.deleteMany({});
  await stopAgenda();
  await closeDatabase();
})

describe('Scheduler', () => {
  describe('Database Backup Scheduled Task', () => {
    test('should schedule database backup task correctly', async () => {
      // Create a mock database backup task
      const task = await Task.create({
        task: 'Database Backup Test-Jobs',
        type: 'Database Backup',
        schedule: '5 seconds',
        taskData: { dbName: 'Jobs', compressionType: 'gzip' },
      });

      // Schedule the task
      await scheduleJobs();

      // Retrieve the scheduled task from the database
      const scheduledTask = await Task.findOne({
        task: 'Database Backup Test-Jobs',
      });

      // Assertion: Verify that the task is scheduled correctly
      expect(scheduledTask).toBeDefined();
      expect(scheduledTask?.type).toBe('Database Backup');
      expect(scheduledTask?.schedule).toBe('5 seconds');
    });
  });

  describe('Database Backup Scheduled Task - Non-existent DB', () => {
    test('should schedule database backup task correctly', async () => {
      // Create a mock database backup task
      const task = await Task.create({
        task: 'Database Backup Test-Mock',
        type: 'Database Backup',
        schedule: '5 seconds',
        taskData: { dbName: 'MockDB', compressionType: 'gzip' },
      });

      // Schedule the task
      await scheduleJobs();

      // Retrieve the scheduled task from the database
      const scheduledTask = await Task.findOne({
        task: 'Database Backup Test-Mock',
      });

      // Assertion: Verify that the task is scheduled correctly
      expect(scheduledTask).toBeDefined();
      expect(scheduledTask?.type).toBe('Database Backup');
      expect(scheduledTask?.schedule).toBe('5 seconds');
    });
  });

  describe('File Transfer Scheduled Task', () => {
    test('should schedule file transfer task correctly', async () => {
      // Create a mock file transfer task
      const task = await Task.create({
        task: 'File Transfer Job',
        type: 'File Transfer',
        schedule: '10 seconds',
        taskData: {
          source: '/home/tim/AutoFlow/README.md',
          destination: '/home/tim/',
        },
      });

      // Schedule the task
      await scheduleJobs();

      // Retrieve the scheduled task from the database
      const scheduledTask = await Task.findOne({ task: 'File Transfer Job' });

      // Assertion: Verify that the task is scheduled correctly
      expect(scheduledTask).toBeDefined();
      expect(scheduledTask?.type).toBe('File Transfer');
      expect(scheduledTask?.schedule).toBe('10 seconds');
    });
  });

  describe('Notification Alert Scheduled Task', () => {
    test('should schedule notification alert task correctly', async () => {
      // Create a mock notification alert task
      const task = await Task.create({
        task: 'Notification Alert Job',
        type: 'Notification Alert',
        schedule: '15 seconds',
        taskData: {
          recipient: RECIPIENT,
          subject: 'Test Subject',
          text: 'Test Message',
        },
      });

      // Schedule the task
      await scheduleJobs();

      // Retrieve the scheduled task from the database
      const scheduledTask = await Task.findOne({ task: 'Notification Alert Job' });

      // Assertion: Verify that the task is scheduled correctly
      expect(scheduledTask).toBeDefined();
      expect(scheduledTask?.type).toBe('Notification Alert');
      expect(scheduledTask?.schedule).toBe('15 seconds');
    });
  });

  describe('Invalid Task Type', () => {
    test('should handle invalid task type gracefully', async () => {
      // Create a mock task with an invalid type
      const task = new Task({
        task: 'Invalid Task',
        type: 'Invalid Type',
        schedule: '20 seconds',
        taskData: {},
      });

      // Schedule the task
      await scheduleJobs();

      // Assertion: Verify that the task is not scheduled
      const scheduledTask = await Task.findOne({ task: 'Invalid Task' });
      expect(scheduledTask).toBeNull();
    });
  });

  describe('Periodic Task Scheduling', () => {
    test('should schedule periodic task correctly', async () => {
      // Create a mock periodic task
      const task = await Task.create({
        task: 'Periodic Task',
        type: 'Database Backup',
        schedule: 'every 1 hour',
        taskData: { dbName: 'MockDB', compressionType: 'gzip' },
      });

      // Schedule the task
      await scheduleJobs();

      // Assertion: Verify that the task is scheduled correctly
      const scheduledTask = await Task.findOne({ task: 'Periodic Task' });
      expect(scheduledTask).toBeDefined();
      expect(scheduledTask?.type).toBe('Database Backup');
      expect(scheduledTask?.schedule).toBe('every 1 hour');
    });
  });
});
