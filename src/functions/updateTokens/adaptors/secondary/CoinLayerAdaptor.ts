import { ICryptoAdaptor } from '../../UpdateTokensDomain';

export interface IRequestAdaptor {
  get: (url: string) => Promise<any>
}

type ConLayerSuccess = {
  privacy: string,
  rates: {
    [token: string]: number
  }
  success: true,
  target: string,
  terms: string,
  timestamp: number
};

type CoinLayerError = {
  success: false,
  error: {
    code: number,
    type: string,
    info: string
  }
};

type CoinLayerGet = ConLayerSuccess | CoinLayerError;

const isGetSuccess = (response: CoinLayerGet): response is ConLayerSuccess => response.success;

export default class CoinLayerAdaptor implements ICryptoAdaptor {
  requestAdaptor: IRequestAdaptor;

  accessKey?: string;

  constructor(requestAdaptor, accessKey) {
    this.requestAdaptor = requestAdaptor;
    this.accessKey = accessKey;
  }

  async getTokensRates() {
    const url = `http://api.coinlayer.com/api/live?access_key=${this.accessKey}`;

    const res: CoinLayerGet = await this.requestAdaptor.get(url);

    if (isGetSuccess(res)) {
      return res.rates;
    }
    return undefined;
  }
}
