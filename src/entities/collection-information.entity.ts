export class CollectionInformation {
  public name: string;
  public price: string;
  public mintLink: string;
  public supply: string;
  public totalQuantity: string;
  public quantitySold: string;
  public change?: string;
  public minted?: string;
  public percentageSold: string;
  public image: string;

  constructor(params: CollectionInformation.Params) {
    this.name = params.name;
    this.price = params.price;
    this.mintLink = params.mintLink;
    this.supply = params.supply;
    this.totalQuantity = params.totalQuantity;
    this.quantitySold = params.quantitySold;
    this.change = params.change;
    this.minted = params.minted;
    this.percentageSold = params.percentageSold;
    this.image = params.image;
  }
}

export namespace CollectionInformation {
  export type Params = {
    name: string;
    price: string;
    mintLink: string;
    supply: string;
    totalQuantity: string;
    quantitySold: string;
    change?: string;
    minted?: string;
    percentageSold: string;
    image: string;
  };
}
