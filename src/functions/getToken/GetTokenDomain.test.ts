import GetTokenDomain, { ICryptoAdaptor } from './GetTokenDomain';

describe('GetTokenDomain', () => {
  describe('getToken', () => {
    it('should fetch for token rate and return it', async () => {
      class MockCryptoAdaptor implements ICryptoAdaptor {
        async getTokenRate(token) {
          const rates = {
            BTC: 12,
            ETH: 10,
          };

          return rates[token];
        }
      }

      const domain = new GetTokenDomain(new MockCryptoAdaptor());

      expect(await domain.getToken('BTC')).toEqual(12);
    });

    it('should throw if the token rate is not returned', async () => {
      class MockCryptoAdaptor implements ICryptoAdaptor {
        async getTokenRate() {
          return undefined;
        }
      }

      const domain = new GetTokenDomain(new MockCryptoAdaptor());

      await expect(domain.getToken('BTC')).rejects.toThrow();
    });
  });
});
