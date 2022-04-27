export type Rates = { [token: string]: number };

export interface ICryptoAdaptor {
  getTokensRates: () => Promise<Rates | undefined>
}

export interface IUpdateTokensDomain {
  cryptoAdaptor: ICryptoAdaptor;
  updateTokens: () => Promise<boolean | void>
}

export interface ICryptoCacheAdaptor {
  saveRates: (Rates: Rates) => Promise<boolean>
}

export interface IInvoker {
  domain: IUpdateTokensDomain;
}

export default class UpdateTokensDomain implements IUpdateTokensDomain {
  cryptoAdaptor: ICryptoAdaptor;

  cacheAdaptor: ICryptoCacheAdaptor;

  constructor(cryptoAdaptor, cacheAdaptor) {
    this.cryptoAdaptor = cryptoAdaptor;
    this.cacheAdaptor = cacheAdaptor;
  }

  async updateTokens() {
    const rates = await this.cryptoAdaptor.getTokensRates();

    if (rates === undefined) {
      throw new Error('Missing Rates for tokens');
    }

    await this.cacheAdaptor.saveRates(rates);

    return true;
  }
}
