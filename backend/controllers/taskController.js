import dbClient from '../config/database.js';
import { ObjectId } from 'mongodb';

const taskController = {
  // Create a new task
  async newTask(req, res) {
    const {task, type} = req.body;
    console.log(`New task created: ${task}`);

    try {
      const tasksCollection = await req.tasksCollection;
      await tasksCollection.insertOne({
        task,
        type
      });
      res.status(201).json({
        message: 'Task created successfully',
        task
      });
    } catch ( error ) {
      console.error('Error creating new task:', error);
      res.status(500).json({
        error: 'Failed to create new task'
      });
    }
  },

  // Get all tasks
  async getAllTasks(req, res) {
    // Retrieve tasksCollection from req
    try {
      const tasksCollection = await req.tasksCollection;
      const tasks = await tasksCollection.find({}).toArray();
      if (!tasks) {
        res.status(404).json({
          error: 'No tasks found'
        });
        return;
      }
      const formattedTasks = tasks.map((task) => {
        return {
          id: task._id,
          task: task.task,
          type: task.type,
          created_at: new Date().toISOString().replace('T', ' ').substr(0, 19)
        };
      });
      res.status(200).json(formattedTasks);
    } catch ( error ) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({
        error: 'Failed to fetch tasks'
      });
    }
  },

  // Get a specific task by ID
  async getTaskById(req, res) {
    try {
      const {taskId} = req.params;
      const tasksCollection = await req.tasksCollection;
      const task = await tasksCollection.findOne({
        _id: new ObjectId(taskId)
      });
      if (!task) {
        res.status(404).json({
          error: 'Task ID not found'
        });
        return;
      }
      res.status(200).json(task);
    } catch ( error ) {
      console.error('Error fetching task by ID:', error);
      res.status(500).json({
        error: 'Failed to fetch task by ID'
      });
    }
  },

  // Update a task by ID
  async updateTask(req, res) {
    // Retrieve taskId and updatedTask from request body
    try {
      const {taskId} = req.params;
      const {task, type} = req.body;
      const tasksCollection = await req.tasksCollection;

      if (!taskId) {
        res.status(404).json({
          error: 'No task ID found'
        });
        return;
      }
      if (!task) {
        res.status(400).json({
          error: 'No task for update'
        });
        return;
      }

      // Check if taskId has a job assigned to it
      const oldTask = await tasksCollection.findOne({
        _id: new ObjectId(taskId)
      });
      if (!oldTask) {
        res.status(404).json({
          error: `No task found with id: ${taskId}`
        });
        return;
      }

      // Update the task
      const result = await tasksCollection.updateOne(
        {
          _id: new ObjectId(taskId)
        },
        {
          $set: {
            task,
            type
          }
        }
      );

      if (result.modifiedCount === 1) {
        res.status(200).json({
          message: 'Task update success!'
        });
      } else {
        res.status(500).json({
          error: 'Failed to update task'
        });
      }
    } catch ( error ) {
      console.error('Error updating task:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  },

  // Delete a task
  async deleteTask(req, res) {
    try {
      const {taskId} = req.params;
      const tasksCollection = await req.tasksCollection;

      // Delete the task
      const result = await tasksCollection
            .deleteOne({
              _id: new ObjectId(taskId)
            });
      if (result.deletedCount === 1) {
        res.status(200).json({
          message: 'Task deleted successfully'
        });
      } else {
        res.status(404).json({
          error: 'Task ID not found'
        });
      }
    } catch ( error ) {
      console.error('Error deleting task:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
};

export default taskController;
