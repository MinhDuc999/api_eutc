import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads/',
    });

    await app.listen(3000);
    console.log('Application is running on: http://localhost:3000');
  } catch (error) {
    console.error('Failed to start application:', error);
  }
}

bootstrap().catch((err) => {
  console.error('Unhandled error during bootstrap:', err);
  process.exit(1);
});
