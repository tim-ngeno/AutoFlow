import backupDatabase from '../tasks/databaseBackup.js';
import logger from '../config/logger.js';
import ftp from 'basic-ftp';
import path from 'path';
import scp from 'scp2';
import fs from 'fs';
import os from 'os';

const taskHandler = {
  performDatabaseBackup: async (db, compressionType = '--gzip') => {
    try {
      const backupFileName = await backupDatabase(db, compressionType);
      return backupFileName;
    } catch (err) {
      throw new Error(`Failed to perform database backup: ${err.message}`);
    }
  },

  performFileTransfer: async (source, destinationDir) => {
    try {
      if (!fs.existsSync(source) || source.length === 0) {
        console.error(`Source file "${source}" does not exist`);
        return;
      }
      // Check if the destination dir exists
      if (!fs.existsSync(destinationDir) || destinationDir.length === 0) {
        console.error(`Destination file "${destinationDir}" does not exist`);
        return;
      }

      // Extract filename from the source path
      const fileName = path.basename(source);

      // Construct the destination file path
      const destination = path.join(destinationDir, fileName);

      // Copy file from source to destination
      fs.copyFileSync(source, destination);
      console.log('Job completed successfully!');
      console.log(`File transferred from "${source}" to "${destination}"`);
    } catch (err) {
      logger.error(`Error performing file transfer: ${err.message}`);
    }
  },

  performSCPFileTransfer: async (source, destination, scpConfig) => {
    return new Promise((resolve, reject) => {
      scp.send({
        file: sourceFilePath,
        host: scpConfig.host,
        username: scpConfig.username,
        password: scpConfig.password,
        path: destination
      }, (err) => {
        if (err) {
	  logger.error(`Error transferring file via SCP: ${err.message}`);
	  reject(err);
        } else {
	  logger.info(`File transferred via SCP from ${source} to` +
		      ` ${destination}`);
	  resolve();
        }
      });
    });
  },

  performFTPFileTransfer: async (source, destination, ftpConfig) => {
    const client = new ftp.Client();
    try {
      await client.access(ftpConfig);

      // Upload file to FTP server
      await client.uploadFrom(source, destination);
      logger.info(`File transferred via FTP from ${source} to ${destination}`);
    } catch (err) {
      logger.error(`Error transferrinf file via FTP: ${err.message}`);
      throw err;
    } finally {
      await client.close();
    }
  }
};

export default taskHandler;
