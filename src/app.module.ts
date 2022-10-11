import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { Axios } from 'axios';
import { DiscordBot } from './controllers/discord-bot.controller';
import { DiscordBotLmnftActivity } from './services/discord-bot-lmnft-activity.service';
import { WebScraping } from './services/web-scraping.service';

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule],
  controllers: [DiscordBot],
  providers: [WebScraping, Axios, DiscordBotLmnftActivity],
})
export class AppModule {}
