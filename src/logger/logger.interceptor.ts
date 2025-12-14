import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { FileLoggerService } from './logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: FileLoggerService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    this.loggingService.log(
      `Incoming request: ${request.method} ${request.url}`,
      'LoggingInterceptor',
    );

    return next.handle().pipe(
      tap({
        next: () => {
          this.loggingService.requestLog(request, response, startTime);
        },
        error: (error) => {
          this.loggingService.error(
            `Request ${request.method} ${request.url} failed`,
            error.stack,
            'LoggerInterceptor',
          );
        },
      }),
    );
  }
}
