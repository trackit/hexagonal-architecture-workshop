import CoinLayerAdaptor, { IRequestAdaptor } from './CoinLayerAdaptor';

describe('CoinLayerAdaptor', () => {
  describe('getTokenRate', () => {
    it('should return the current market Rate of a token', async () => {
      class MockRequestAdaptor implements IRequestAdaptor {
        async get(url) {
          expect(url).toEqual('http://api.coinlayer.com/api/live?access_key=fakeAccessKey');
          return ({
            privacy: 'https://coinlayer.com/privacy',
            rates: {
              BTC: 35600.131193,
              ETH: 2397.713685,
            },
            success: true,
            target: 'USD',
            terms: 'https://coinlayer.com/terms',
            timestamp: 1645711267,
          });
        }
      }

      const adaptor = new CoinLayerAdaptor(new MockRequestAdaptor(), 'fakeAccessKey');

      expect(await adaptor.getTokensRates()).toEqual({
        BTC: 35600.131193,
        ETH: 2397.713685,
      });
    });
  });
});
