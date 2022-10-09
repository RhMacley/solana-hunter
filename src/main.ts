import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Discord } from './services/discord.service';
import { WebScraping } from './services/web-scraping.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);
  console.log(`Application running on http://localhost:3000`);
}
bootstrap();
