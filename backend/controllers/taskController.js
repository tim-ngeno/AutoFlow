import dbClient from '../config/database.js';
import Task from '../models/Task.js';

const taskController = {
  async newTask (req, res) {
    const { task, type, schedule } = req.body;
    console.log('New task created:', task);

    try {
      const newTask = await Task.create({ task, type, schedule });
      res.status(201).json({
        message: 'Created successfully!',
        task: newTask
      });
    } catch (err) {
      console.error('Error creating new task:', err);
      res.status(500).json({
        error: 'Failed to create new task'
      });
    }
  },

  async  getAllTasks (req, res) {
    try {
      const tasks = await Task.find({});
      res.status(200).json(tasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
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
      console.error('Error fetching task by ID:', err);
      res.status(500).json({
        error: 'Failed to fetch task by ID'
      });
    }
  },

  async updateTask (req, res) {
    try {
      const { taskId } = req.params;
      const { task, type, schedule } = req.body;
      const updatedTask = await Task.findByIdAndUpdate(
        taskId, { task, type, schedule }, { new: true }
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
    } catch (err) {
      console.error('Error updating task:', err);
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
      console.error('Error deleting task', err);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
};

export default taskController;
