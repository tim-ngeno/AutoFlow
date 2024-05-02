import backupDatabase from '../tasks/databaseBackup.js';
import logger from '../config/logger.js';
// import { Client } from 'basic-ftp';
import path from 'path';
import { Client } from 'scp2';
import fs from 'fs';
import os from 'os';

interface ScpConfig {
  host: string;
  username: string;
  password: string;
}

interface FtpConfig {
  host: string;
  user: string;
  password: string;
  port?: number;
}

const taskHandler = {
  performDatabaseBackup: async (db, compressionType: string = '--gzip') => {
    try {
      const backupFileName = await backupDatabase(db, compressionType);
      return backupFileName;
    } catch (err: unknown) {
      throw new Error(`Failed to perform database backup: ${(err as Error).message}`);
    }
  },

  performFileTransfer: async (source: string, destinationDir: string) => {
    try {
      if (!fs.existsSync(source) || source.length === 0) {
        logger.error(`Source file "${source}" does not exist`);
        return;
      }
      // Check if the destination dir exists
      if (!fs.existsSync(destinationDir) || destinationDir.length === 0) {
        logger.error(`Destination file "${destinationDir}" does not exist`);
        return;
      }

      // Extract filename from the source path
      const fileName = path.basename(source);

      // Construct the destination file path
      const destination = path.join(destinationDir, fileName);

      // Copy file from source to destination
      fs.copyFileSync(source, destination);
      logger.info('Job completed successfully!');
      logger.info(`File transferred from "${source}" to "${destination}"`);
    } catch (err: unknown) {
      logger.error(`Error performing file transfer: ${(err as Error).message}`);
    }
  },

  performSCPFileTransfer: async (source: string, destination: string, scpConfig: ScpConfig): Promise<void> => {
    return new Promise((resolve, reject) => {
      const scpClient = new Client();
      scpClient.send({
        file: source,
        host: scpConfig.host,
        username: scpConfig.username,
        password: scpConfig.password,
        path: destination
      }, (err: Error) => {
        if (err) {
	  logger.error(`Error transferring file via SCP: ${(err as Error).message}`);
	  reject(err);
        } else {
	  logger.info(`File transferred via SCP from ${source} to` +
		      ` ${destination}`);
	  resolve();
        }
      });
    });
  },

  // performFTPFileTransfer: async (source: string, destination: string, ftpConfig: FtpConfig): Promise<void> => {
  //   const client = new Client();
  //   try {
  //     await client.access(ftpConfig);

  //     // Upload file to FTP server
  //     await client.uploadFrom(source, destination);
  //     logger.info(`File transferred via FTP from ${source} to ${destination}`);
  //   } catch (err: unknown) {
  //     logger.error(`Error transferrinf file via FTP: ${(err as Error).message}`);
  //     throw err;
  //   } finally {
  //     await client.close();
  //   }
  // }
};

export default taskHandler;
