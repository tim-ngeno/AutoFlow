import dbClient from '../config/database.js';
import { spawn } from 'child_process';
import { format } from 'date-fns';

const formattedTime = () => {
  return format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
};

const backupDatabase = async (dbName, compressionType = '--gzip') => {
  return new Promise(async (resolve, reject) => {
    try {
      await dbClient.connection;

      // Check if dbName is an existing database
      const dbList = await dbClient.connection.db.admin().listDatabases();
      const existingDbs = dbList.databases.map((db) => db.name);
      if (!existingDbs.includes(dbName)) {
        console.error(`Database ${dbName} does not exist`);
        return;
      }

      const currentTime = formattedTime();
      const backupFileName = `../${dbName}-backup-${currentTime}.gz`;

      console.log('Starting database backup---', backupFileName);

      const backupProcess = spawn('mongodump', [
	`--db=${dbName}`,
	`--archive=${backupFileName}`,
	compressionType
      ]);

      backupProcess.on('error', (err) => {
        reject(new Error(`Backup process failed: ${err.message}`));
      });

      backupProcess.on('exit', (code, signal) => {
        if (code) {
          reject(new Error(`Backup process exited with code ${code}`));
        } else if (signal) {
          reject(new Error('Backup terminated with signal: ${signal}'));
        } else {
          console.log(`Database "${dbName}" backup success! Backup location:` +
		      ` ${backupFileName}`);
          resolve();
        }
      });
    } catch (err) {
      reject(new Error(`Failed to initiate backup: ${err.message}`));
    }
  });
};

export default backupDatabase;
