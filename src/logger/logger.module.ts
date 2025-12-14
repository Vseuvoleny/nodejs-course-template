import { Global, Module } from '@nestjs/common';
import { FileLoggerService } from './logger.service';
import { LoggerInterceptor } from './logger.interceptor';

@Global()
@Module({
  providers: [FileLoggerService, LoggerInterceptor],
  exports: [FileLoggerService, LoggerInterceptor],
})
export class LoggerModule {}
