import authController from '../controllers/authController.js';
import express from 'express';

const router = express.Router();

router.get('/', authController.getHome);
router.get('/user', authController.getUser);

export default router;
