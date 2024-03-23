import authRoutes from './backend/routes/authRoutes.js';
import taskRoutes from './backend/routes/taskRoutes.js';
import agenda from './backend/config/agenda.js';
import express from 'express';
import 'dotenv/config';

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

app.use(authRoutes);
app.use('/api', taskRoutes);

// Define and schedule agenda jobs
agenda.on('ready', () => {
  agenda.schedule('3 seconds', 'data');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
