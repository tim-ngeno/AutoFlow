import winston from 'winston';

const { combine, cli, json, prettyPrint, timestamp } = winston.format;

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    cli()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File(
      {
        filename: 'autoflow.error.log',
        level: 'error',
        format: combine(
	  json(),
	  timestamp(),
	  prettyPrint()
        )
      }
    )
  ]
});

export default logger;
