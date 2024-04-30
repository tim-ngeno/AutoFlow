import scheduleJobs from '../controllers/jobController.js';
import dbClient from '../config/database.js';
import logger from '../config/logger.js';
import Task from '../models/Task.js';

const taskController = {
  async createTask (req, res) {
    try {
      const { task, type, schedule, taskData } = req.body;
      const newTask = await Task.create({
        task,
        type,
        schedule,
        taskData
      });

      console.log('New task created:', newTask);
      res.status(201).json(newTask);
      await scheduleJobs();
    } catch (err) {
      logger.error('Creating new task failed:', err);
      res.status(500).json({ error: 'Failed to create new task' });
    }
  },

  async  getAllTasks (req, res) {
    try {
      const tasks = await Task.find({});
      res.status(200).json(tasks);
    } catch (err) {
      logger.error('Error fetching tasks:', err);
      res.status(500).json({
        error: 'Failed to fetch tasks'
      });
    }
  },

  async getTaskById (req, res) {
    try {
      const { taskId } = req.params;
      const task = await Task.findById(taskId);
      if (!task) {
        res.status(404).json({
	  error: ' Task ID not found'
        });
        return;
      }
      res.status(200).json(task);
    } catch (err) {
      logger.error('Error fetching task by ID:', err);
      res.status(500).json({
        error: 'Failed to fetch task by ID'
      });
    }
  },

  async updateTask (req, res) {
    try {
      const { taskId } = req.params;
      const { task, type, schedule, taskData } = req.body;

      const updatedTask = await Task.findByIdAndUpdate(
        taskId, { task, type, schedule, taskData }, { new: true }
      );
      if (!updatedTask) {
        res.status(400).json({
	  error: 'Task ID not found'
        });
        return;
      }
      res.status(200).json({
        message: 'Update success!',
        task: updatedTask
      });
      await scheduleJobs();
    } catch (err) {
      logger.error('Error updating task:', err);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  },

  async deleteTask (req, res) {
    try {
      const { taskId } = req.params;

      const deletedTask = await Task.findByIdAndDelete(taskId);
      if (!deletedTask) {
        res.status(404).json({
	  error: 'Task ID not found'
        });
        return;
      }
      res.status(200).json({
        message: 'Deleted successfully'
      });
    } catch (err) {
      logger.error('Error deleting task', err);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
};

export default taskController;
