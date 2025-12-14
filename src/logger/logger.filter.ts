import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { FileLoggerService } from './logger.service';

@Catch()
export class LoggerFilter implements ExceptionFilter {
  constructor(
    @Inject(FileLoggerService)
    private readonly logger: FileLoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof message === 'object' ? message : { message },
    };

    const logMessage = `${request.method} ${request.url} ${status}`;
    const errorStack = exception instanceof Error ? exception.stack : undefined;

    if (status >= 500) {
      this.logger.error(logMessage, errorStack, 'ExceptionFilter');
    } else {
      this.logger.info(logMessage, 'ExceptionFilter');
    }

    response.status(status).json(errorResponse);
  }
}
