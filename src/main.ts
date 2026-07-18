import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { CorsOptions } from '@nestjs/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const corsOptions: CorsOptions = {
  //   origin: ['http://localhost:4200'], // permitir requisições de um determinado domínio
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // permitir métodos HTTP
  //   preflightContinue: false,
  //   optionsSuccessStatus: 204,
  //   credentials: true, // permitir credenciais (cookies, etc.)
  // };

  
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: false,
  });

  const primaryPort = process.env.PORT || 3510;
  const fallbackPort = 3501;

  try {
    await app.listen(primaryPort);
    console.log(`Application is running on: http://localhost:${primaryPort}`);
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${primaryPort} is in use, trying alternative port ${fallbackPort}`);
      await app.listen(fallbackPort);
      console.log(`Application is running on: http://localhost:${fallbackPort}`);
    } else {
      throw error;
    }
  }
}

bootstrap();
