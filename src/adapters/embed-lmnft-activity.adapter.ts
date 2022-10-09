import { CollectionInformation } from 'src/entities/collection-information.entity';
import { IEmbedLmnftActivity } from 'src/interfaces/embed-lmnft-activity.interface';

export class EmbedLmnftActivityAdapter {
  public command(params: CollectionInformation): IEmbedLmnftActivity {
    const data = {
      color: 0x00ff00,
      title: params.name,
      url: params.mintLink,
      author: {
        name: 'LMNFT-BOT-ACTIVITY',
        icon_url:
          'https://pbs.twimg.com/profile_images/1565798003058827270/MZr-ThGD_400x400.jpg',
        url: 'https://twitter.com/Tmclyy',
      },
      description: 'LMNFT Activity',
      thumbnail: {
        url: params.image,
      },
      fields: [
        {
          name: 'Price',
          value: `${params.price} Sol`,
          inline: true,
        },
        {
          name: 'Supply',
          value: params.supply,
          inline: true,
        },
        {
          name: 'Sold',
          value: `${params.percentageSold}`,
          inline: true,
        },
        { name: '\u200B', value: '\u200B' },
        {
          name: 'Minted',
          value: `+ ${params.minted}`,
          inline: true,
        },
        {
          name: 'Change',
          value: `+ ${params.change}%`,
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Developed by Tmacley',
        icon_url:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtmvCupQE8DvXAX1922ggCvnVxP5Rjbrei3g&usqp=CAU',
      },
    };
    return data;
  }
}
