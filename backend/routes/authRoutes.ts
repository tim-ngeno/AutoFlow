import authController from '../controllers/authController';
import express from 'express';

const router = express.Router();

router.get('/', authController.getHome);
router.get('/user', authController.getUser);

export default router;
