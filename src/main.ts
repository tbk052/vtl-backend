/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000, () => {
    console.info(`Server is running on http://localhost:3001`);
    console.info(`Docs: http://localhost:3001/docs`);
  });
}
void bootstrap();
