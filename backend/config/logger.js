import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.cli()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'autoflow.log' })
  ]
});

export default logger;
