import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from './validation/validation.pipe';
import { AuthGuard } from './auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = app.get(ConfigService);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuard(reflector, new JwtService()));
  const PORT = config.get('PORT') || 4000;
  await app.listen(PORT);
}
bootstrap();
