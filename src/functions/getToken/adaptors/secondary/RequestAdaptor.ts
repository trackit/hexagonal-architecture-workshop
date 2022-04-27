import { IRequestAdaptor } from './CoinLayerAdaptor';

export default class RequestAdaptor implements IRequestAdaptor {
  fetch: (url: string) => Promise<{ json: () => any }>;

  constructor(fetch) {
    this.fetch = fetch;
  }

  async get(url: string) {
    const response = await this.fetch(url);
    return response.json();
  }
}
