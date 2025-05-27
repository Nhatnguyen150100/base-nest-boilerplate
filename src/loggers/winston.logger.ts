import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

const buildPathFileLog = (filename: string): string => {
  return `${process.cwd()}/src/logs/${filename}`;
};

export const winstonLoggerOptions: winston.LoggerOptions = {
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('Nest', {
          prettyPrint: true,
        }),
      ),
    }),

    new winston.transports.DailyRotateFile({
      filename: buildPathFileLog('info-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),

    new winston.transports.DailyRotateFile({
      filename: buildPathFileLog('error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
};
