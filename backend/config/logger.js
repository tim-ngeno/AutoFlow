import winston from 'winston';

const { combine, cli, json, prettyPrint, simple, timestamp } = winston.format;

const timezoned = () => {
  return new Date().toLocaleString('en-US');
};

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    cli(),
    timestamp({ format: timezoned })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'autoflow.error.logs',
      level: 'error',
      format: combine(
        json(),
        timestamp({ format: timezoned }),
        prettyPrint()
      )
    }),
    new winston.transports.File({
      filename: 'autoflow.logs',
      format: combine(
        json(),
        timestamp({ format: timezoned }),
        prettyPrint()
      )
    })
  ]
});

export default logger;
