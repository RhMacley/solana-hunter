import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { Axios } from 'axios';
import { GetInformations } from './controllers/get-informations.controller';
import { Discord } from './services/discord.service';
import { WebScraping } from './services/web-scraping.service';

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule],
  controllers: [GetInformations],
  providers: [WebScraping, Axios, Discord],
})
export class AppModule {}
