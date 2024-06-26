import taskController from '../controllers/taskController';
import initializeMongoDB from '../middleware/tasksMiddleware';
import express from 'express';

// Router handler
const router = express.Router();

// Apply middleware to routes
router.use(initializeMongoDB);

// Handle CRUD operations for all tasks
router.post('/tasks', taskController.createTask);
router.get('/tasks', taskController.getAllTasks);
router.get('/tasks/:taskId', taskController.getTaskById);
router.put('/tasks/:taskId', taskController.updateTask);
router.delete('/tasks/:taskId', taskController.deleteTask);

export default router;
