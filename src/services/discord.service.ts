import { Injectable } from '@nestjs/common';
import { Client, TextChannel } from 'discord.js';
import { EmbedLmnftActivityAdapter } from 'src/adapters/embed-lmnft-activity.adapter';
import { WebScraping } from './web-scraping.service';
import * as fs from 'fs';
import { CollectionInformation } from 'src/entities/collection-information.entity';

@Injectable()
export class Discord {
  constructor(private readonly webScraping: WebScraping) {}

  public async handle() {
    const token =
      'NzY0NjU3Nzg3MzQyNTUzMTE5.Ghxf7V.5KsKJ0VA0o7DlZxwex8jW-jJhEY4Q-Osd_7Q7M';
    const client = new Client({
      intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'],
    });
    await client.login(token);
    client.once('ready', () => {
      console.log('Ready!');
    });

    const channel = (await client.channels.fetch(
      '1026291109636358194',
    )) as TextChannel;

    const informations = await this.webScraping.handle();

    if (fs.existsSync('jsonzinho.json')) {
      const newInformations: Array<CollectionInformation> = JSON.parse(
        JSON.stringify(informations),
      );
      const oldInformations: Array<CollectionInformation> = JSON.parse(
        fs.readFileSync('jsonzinho.json', 'utf-8'),
      );
      for (let i = 0; i < oldInformations.length; i++) {
        for (let k = 0; k < newInformations.length; k++) {
          if (
            newInformations[k].name === oldInformations[i].name &&
            Number(newInformations[k].quantitySold) -
              Number(oldInformations[i].quantitySold) >
              0
          ) {
            console.log('Something has changed...');
            let nameOfCollection = newInformations[k].name;
            let oldQuantity = Number(oldInformations[i].quantitySold);
            let newQuantity = Number(newInformations[k].quantitySold);
            let minted = newQuantity - oldQuantity;
            let percentageUp = ((minted * 100) / newQuantity).toFixed(2);
            console.log(
              `Informations updated: Collection ${nameOfCollection} was minted more ${minted} and increased your percentage by + ${percentageUp}%`,
            );
            newInformations[k].change = String(percentageUp);
            newInformations[k].minted = String(minted);
            const adapter = new EmbedLmnftActivityAdapter();
            const embedAdapted = adapter.command(newInformations[k]);
            channel.send({ embeds: [embedAdapted] });
            oldInformations[i].quantitySold = newInformations[k].quantitySold;
            fs.writeFileSync('jsonzinho.json', JSON.stringify(oldInformations));
            console.log('Informations already sent to the discord bot...');
            break;
          }
        }
      }
    } else {
      fs.writeFileSync('jsonzinho.json', JSON.stringify(informations));
    }
  }
}
