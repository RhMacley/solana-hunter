import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { WebScraping } from 'src/services/web-scraping.service';
import { Response as HttpResponse } from 'express';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Discord } from 'src/services/discord.service';
import { CollectionInformation } from 'src/entities/collection-information.entity';

@Controller()
export class GetInformations {
  constructor(
    private readonly webScraping: WebScraping,
    private readonly discordBot: Discord,
  ) {}
  @Get('/collections')
  async get(
    @Res() response: HttpResponse<CollectionInformation[]>,
  ): Promise<any> {
    const collectionInformations = await this.webScraping.handle();
    return response.status(HttpStatus.OK).json(collectionInformations);
  }

  @Get()
  async ping(@Res() response: HttpResponse<any>): Promise<any> {
    return response.status(HttpStatus.OK).json('Seja bem vindo');
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async run(): Promise<any> {
    await this.discordBot.handle();
  }
}
