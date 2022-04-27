export interface ICryptoAdaptor {
  getTokenRate: (string) => Promise<number | undefined>
}

export interface IGetTokenDomain {
  cryptoAdaptor: ICryptoAdaptor;
  getToken: (token: string) => Promise<number | void>
}

export interface IInvoker {
  domain: IGetTokenDomain;
}

export default class GetTokenDomain implements IGetTokenDomain {
  cryptoAdaptor: ICryptoAdaptor;

  constructor(cryptoAdaptor) {
    this.cryptoAdaptor = cryptoAdaptor;
  }

  async getToken(token) {
    const rate = await this.cryptoAdaptor.getTokenRate(token);

    if (rate === undefined) {
      throw new Error(`Missing rate for token ${token}`);
    }

    return rate;
  }
}
