import { IUpdateTokensDomain, IInvoker } from '../../UpdateTokensDomain';

export default class EventBridgeAdaptor implements IInvoker {
  domain: IUpdateTokensDomain;

  constructor(domain) {
    this.domain = domain;
  }

  async handler(): Promise<boolean> {
    try {
      const res = await this.domain.updateTokens();
      if (res) {
        return true;
      }
    } catch (e) {
      throw e;
    }
    throw new Error('Domain returned false');
  }
}
