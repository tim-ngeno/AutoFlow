import winston, { Logger, transports, format } from 'winston';

const { combine, cli, json, prettyPrint, simple, timestamp } = format;

const timezoned = () => {
  return new Date().toLocaleString('en-US');
};

const logger: Logger = winston.createLogger({
  level: 'info',
  format: combine(
    cli(),
    timestamp({ format: timezoned })
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'autoflow.error.logs',
      level: 'error',
      format: combine(
        json(),
        timestamp({ format: timezoned }),
        prettyPrint()
      )
    }),
    new transports.File({
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
