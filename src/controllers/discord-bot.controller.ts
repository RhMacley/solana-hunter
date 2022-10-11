import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { WebScraping } from 'src/services/web-scraping.service';
import { Response as HttpResponse } from 'express';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CollectionInformation } from 'src/entities/collection-information.entity';
import * as fs from 'fs';
import { DiscordBotLmnftActivity } from 'src/services/discord-bot-lmnft-activity.service';

@Controller()
export class DiscordBot {
  constructor(
    private readonly webScraping: WebScraping,
    private readonly discordBotLmnftActivity: DiscordBotLmnftActivity,
  ) {}
  @Get()
  async ping(@Res() response: HttpResponse<any>): Promise<any> {
    return response.status(HttpStatus.OK).json('Seja bem vindo');
  }

  @Get('/collections')
  async get(
    @Res() response: HttpResponse<CollectionInformation[]>,
  ): Promise<any> {
    const collectionInformations = await this.webScraping.handle();
    return response.status(HttpStatus.OK).json(collectionInformations);
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async run(): Promise<any> {
    await this.discordBotLmnftActivity.handle();
  }

  @Cron(CronExpression.EVERY_3_HOURS)
  async delete(): Promise<any> {
    if (fs.existsSync('jsonzinho.json')) {
      fs.unlinkSync('jsonzinho.json');
    }
  }
}
