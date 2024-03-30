import mongoose, { Schema } from 'mongoose';

const databaseBackupSchema = new Schema({
  dbName: String,
  compressionType: String
});

const fileTransferSchema = new Schema({
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  }
});

const notificationAlertSchema = new Schema({
  recipient: String,
  subject: String,
  text: String
});

const taskSchema = new Schema({
  task: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Database Backup', 'File Transfer', 'Notification Alert'],
    required: true
  },
  schedule: {
    type: String,
    required: true
  },
  modified_at: {
    type: Date,
    default: Date.now
  },
  taskData: {
    type: Schema.Types.Mixed,
    required: true
  }
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
