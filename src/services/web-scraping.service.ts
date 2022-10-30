import { Injectable } from '@nestjs/common';
import puppeteer, { Page } from 'puppeteer';
import { CollectionInformation } from 'src/entities/collection-information.entity';

@Injectable()
export class WebScraping {
  public async handle(): Promise<CollectionInformation[]> {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const browserPage = await browser.newPage();
    const result = await this.accessPageAndGetInformations(browserPage);
    await browser.close();
    return result;
  }

  public async accessPageAndGetInformations(
    page: Page,
  ): Promise<CollectionInformation[]> {
    console.log('Accessing the webpage...');
    await page.goto(
      'https://launchmynft.io/explore?sort=hot&sortBy=collections%2Fsort%2FlastMintedAt%3Adesc&page=1&toggle%5BtwitterVerified%5D=false&refinementList%5Btype%5D%5B0%5D=Solana',
    );
    await page.waitForSelector('div > div > div > div > div > a');
    const urls = await page.$$eval('div > div > div > div > div > a', (el) => {
      return el.map((a) => a.getAttribute('href'));
    });
    console.log('Get URLS...');
    let finalResult: Array<CollectionInformation> = [];
    console.log('Get informations...');
    for (let item of urls) {
      await page.goto(`https://launchmynft.io${item}`);
      await page.waitForSelector('div > div > div > div > div > span');
      let soldMinteds = await page.$eval(
        'div > div > div > div > div > span',
        (element) => {
          return element.textContent;
        },
      );
      if (soldMinteds === 'Public sale in') {
        soldMinteds = await page.$eval(
          'div > div > div > div > div > div:nth-child(4) > span',
          (element) => {
            return element.textContent;
          },
        );
      }
      const supply = soldMinteds.split('(')[1].slice(0, -1);
      const quantitySold = supply.split('/')[0];
      const totalQuantity = supply.split('/')[1];
      const percentageSold = soldMinteds.split(' ')[0];
      const price = await this.tryGetPriceProperty(page, [
        'div > div > div > div > div:nth-child(3) > div > strong',
        'div > div > div > div > div > div > div > strong',
        'div > div > div > div > div > div:nth-child(4) > div > strong',
      ]);
      console.log('price ->', price);

      const collectionName = await page.$eval('div > div > h1', (element) => {
        return element.textContent;
      });
      const image = await this.tryGetImageProperty(page, [
        'div > div > div > div > span > img',
        'div > div > div > div:nth-child(2) > span > img',
        'div > div > div > div > div > div > div > div> img',
      ]);
      const result = new CollectionInformation({
        name: collectionName,
        price,
        mintLink: `https://launchmynft.io${item}`,
        supply,
        totalQuantity,
        quantitySold,
        percentageSold,
        image: `https://launchmynft.io${image}`,
      });
      finalResult.push(result);
    }
    await page.close();
    return finalResult;
  }

  private async tryGetPriceProperty(
    page: Page,
    pagesToEvaluate: Array<string>,
  ) {
    for (const pageEvaluate of pagesToEvaluate) {
      let price: string;
      try {
        price = await page.$eval(pageEvaluate, (element) => {
          return element.textContent;
        });
        return price;
      } catch (error) {
        console.log('error ->', error);
        continue;
      }
    }
  }

  private async tryGetImageProperty(
    page: Page,
    imagesToEvaluate: Array<string>,
  ) {
    for (const images of imagesToEvaluate) {
      let price: string;
      try {
        price = await page.$eval(images, (element) => {
          return element.getAttribute('src');
        });
        return price;
      } catch (error) {
        console.log('error ->', error);
        continue;
      }
    }
  }
}
