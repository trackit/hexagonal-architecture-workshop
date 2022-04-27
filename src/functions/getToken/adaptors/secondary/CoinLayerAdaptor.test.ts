import CoinLayerAdaptor, { IRequestAdaptor } from './CoinLayerAdaptor';

describe('CoinLayerAdaptor', () => {
  describe('getTokenRate', () => {
    const generateMockRequestAdaptor = (token, value) => {
      class MockRequestAdaptor implements IRequestAdaptor {
        async get(url) {
          expect(url).toEqual(`http://api.coinlayer.com/api/live?access_key=fakeAccessKey&symbols=${token}`);
          return ({
            privacy: 'https://coinlayer.com/privacy',
            rates: {
              [token]: value,
            },
            success: true,
            target: 'USD',
            terms: 'https://coinlayer.com/terms',
            timestamp: 1645711267,
          });
        }
      }
      return new MockRequestAdaptor();
    };

    it('should return the current market rate of a token', async () => {
      const tokens = [
        { token: 'BTC', value: 35600.131193 },
        { token: 'ETH', value: 2397.713685 },
      ];

      await Promise.all(tokens.map(async ({ token, value }) => {
        const mockedRequestAdaptor = generateMockRequestAdaptor(token, value);
        const adaptor = new CoinLayerAdaptor(mockedRequestAdaptor, 'fakeAccessKey');

        expect(await adaptor.getTokenRate(token)).toEqual(value);
      }));
    });
  });
});
