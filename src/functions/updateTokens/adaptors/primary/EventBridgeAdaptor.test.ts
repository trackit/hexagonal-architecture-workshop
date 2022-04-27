import EventBridgeAdaptor from './EventBridgeAdaptor';
import { IUpdateTokensDomain } from '../../UpdateTokensDomain';

describe('EventBridgeAdaptor', () => {
  it('should return true if the domain does not throw', async () => {
    class Domain implements IUpdateTokensDomain {
      cryptoAdaptor: null;

      async updateTokens() {
        return true;
      }
    }

    const adaptor = new EventBridgeAdaptor(new Domain());

    expect(await adaptor.handler()).toEqual(true);
  });

  it('should throw when domain return false', async () => {
    class Domain implements IUpdateTokensDomain {
      cryptoAdaptor: null;

      async updateTokens() {
        return false;
      }
    }

    const adaptor = new EventBridgeAdaptor(new Domain());

    await expect(adaptor.handler()).rejects.toThrow();
  });

  it('should throw when domain throw an error', async () => {
    class Domain implements IUpdateTokensDomain {
      cryptoAdaptor: null;

      async updateTokens() {
        throw new Error();
      }
    }

    const adaptor = new EventBridgeAdaptor(new Domain());

    await expect(adaptor.handler()).rejects.toThrow();
  });
});
