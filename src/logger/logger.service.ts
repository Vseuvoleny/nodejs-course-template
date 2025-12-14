import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export enum LogLevelEnum {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

@Injectable()
export class FileLoggerService implements LoggerService {
  private readonly logLevels: LogLevel[];
  private readonly logDir: string;
  private readonly maxFileSize: number;
  private currentFileSize: number = 0;
  private currentFile: string;
  private writeStream: fs.WriteStream;

  constructor() {
    const logLevel = process.env.LOG_LEVEL || 'info';
    this.logDir = process.env.LOG_DIR || './logs';
    this.maxFileSize = parseInt(process.env.LOG_MAX_FILE_SIZE || '10240');

    this.logLevels = this.getLogLevels(logLevel);

    this.ensureLogDirectory();
    this.currentFile = this.getCurrentLogFile();
    this.createWriteStream();
    this.setupUncaughtHandlers();

    this.info('File logging service initialized', 'FileLoggingService');
  }

  private getLogLevels(level: string): LogLevel[] {
    const levels = {
      error: [LogLevelEnum.ERROR],
      info: [LogLevelEnum.ERROR, LogLevelEnum.INFO],
      verbose: [LogLevelEnum.ERROR, LogLevelEnum.INFO, LogLevelEnum.VERBOSE],
    };
    return levels[level.toLowerCase()] || levels.info;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.logLevels.includes(level);
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private getCurrentLogFile(): string {
    const date = new Date().toISOString().split('T')[0];

    if (
      !fs.existsSync(this.logDir) ||
      fs.readdirSync(this.logDir).length === 0
    ) {
      return path.join(this.logDir, `app-${date}-001.log`);
    }

    const files = fs
      .readdirSync(this.logDir)
      .filter((f) => f.startsWith(`app-${date}`) && f.endsWith('.log'))
      .sort();

    if (files.length === 0) {
      return path.join(this.logDir, `app-${date}-001.log`);
    }

    const lastFile = files[files.length - 1];
    const lastFilePath = path.join(this.logDir, lastFile);

    try {
      const stats = fs.statSync(lastFilePath);

      if (stats.size >= this.maxFileSize * 1024) {
        const match = lastFile.match(/app-(\d{4}-\d{2}-\d{2})-(\d{3})\.log/);
        const num = match ? parseInt(match[2]) + 1 : 1;
        return path.join(
          this.logDir,
          `app-${date}-${num.toString().padStart(3, '0')}.log`,
        );
      }

      return lastFilePath;
    } catch (error) {
      return path.join(this.logDir, `app-${date}-001.log`);
    }
  }

  private createWriteStream(): void {
    if (this.writeStream) {
      this.writeStream.end();
    }

    if (fs.existsSync(this.currentFile)) {
      const stats = fs.statSync(this.currentFile);
      this.currentFileSize = stats.size;
    } else {
      this.currentFileSize = 0;
    }

    this.writeStream = fs.createWriteStream(this.currentFile, {
      flags: 'a',
      encoding: 'utf8',
    });

    this.writeStream.on('error', (error) => {
      console.error(`Write stream error: ${error.message}`);
    });
  }

  private checkFileSize(): void {
    if (this.currentFileSize >= this.maxFileSize * 1024) {
      this.currentFile = this.getCurrentLogFile();
      this.createWriteStream();
    }
  }

  private writeLog(
    level: LogLevel,
    message: any,
    context?: string,
    trace?: string,
  ): void {
    if (!this.shouldLog(level)) {
      return;
    }

    try {
      const timestamp = new Date().toISOString();
      const pid = process.pid;

      const formattedMessage =
        typeof message === 'object' ? JSON.stringify(message) : String(message);

      const logEntry = {
        timestamp,
        level: level.toUpperCase(),
        pid,
        context: context || 'Application',
        message: formattedMessage,
        ...(trace && { trace }),
      };

      const logString = JSON.stringify(logEntry) + '\n';
      const byteLength = Buffer.byteLength(logString);

      if (this.writeStream && !this.writeStream.destroyed) {
        this.writeStream.write(logString);
        this.currentFileSize += byteLength;
        this.checkFileSize();
      } else {
        console.error('Write stream is not available');
        console.log(`[${level.toUpperCase()}] ${formattedMessage}`);
      }
    } catch (error) {
      console.error(`Failed to write log: ${error.message}`);
      console.log(`[${level.toUpperCase()}] ${message}`);
    }
  }

  error(message: any, trace?: string, context?: string): void {
    this.writeLog(LogLevelEnum.ERROR, message, context, trace);
  }

  log(message: any, context?: string): void {
    this.writeLog(LogLevelEnum.INFO as LogLevel, message, context);
  }

  info(message: any, context?: string): void {
    this.writeLog(LogLevelEnum.INFO as LogLevel, message, context);
  }

  warn(message: any, context?: string): void {
    this.writeLog(LogLevelEnum.WARN, message, context);
  }

  verbose(message: any, context?: string): void {
    this.writeLog(LogLevelEnum.INFO as LogLevel, message, context);
  }

  requestLog(request: any, response: any, startTime: number): void {
    if (!this.shouldLog(LogLevelEnum.INFO as LogLevel)) {
      return;
    }

    try {
      const { method, originalUrl, query, body, ip } = request;
      const { statusCode } = response;
      const responseTime = Date.now() - startTime;

      const logData = {
        type: 'HTTP_REQUEST',
        method,
        url: originalUrl,
        query: query || {},
        body: this.sanitizeBody(body),
        ip,
        statusCode,
        responseTime: `${responseTime}ms`,
      };

      const level = statusCode >= 500 ? LogLevelEnum.ERROR : LogLevelEnum.INFO;
      this.writeLog(level as LogLevel, logData, 'HTTP');
    } catch (error) {
      this.error(
        `Failed to log request: ${error.message}`,
        error.stack,
        'FileLoggingService',
      );
    }
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sanitized = { ...body };
    const sensitiveFields = 'password';
    if (sensitiveFields in sanitized) {
      sanitized[sensitiveFields] = 'XXXXX';
    }

    return sanitized;
  }

  private setupUncaughtHandlers(): void {
    process.on('uncaughtException', (error: Error) => {
      this.error(
        `Uncaught Exception: ${error.message}`,
        error.stack,
        'Process',
      );

      setTimeout(() => {
        process.exit(1);
      }, 1000);
    });

    process.on('unhandledRejection', (reason: any) => {
      const message =
        reason instanceof Error
          ? `Unhandled Rejection: ${reason.message}`
          : `Unhandled Rejection: ${JSON.stringify(reason)}`;

      const stack = reason instanceof Error ? reason.stack : undefined;

      this.error(message, stack, 'Process');
    });
  }

  onModuleDestroy(): void {
    if (this.writeStream && !this.writeStream.destroyed) {
      this.writeStream.end();
    }
  }
}
