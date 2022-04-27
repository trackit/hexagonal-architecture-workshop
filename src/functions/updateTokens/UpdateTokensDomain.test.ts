import UpdateTokensDomain, { ICryptoAdaptor, ICryptoCacheAdaptor, Rates } from './UpdateTokensDomain';

describe('UpdateTokensDomain', () => {
  describe('updateTokens', () => {
    it('should fetch for tokens and store in cache', async () => {
      const fakeRates = {
        BTC: 12,
        ETH: 10,
      };
      class MockCryptoAdaptor implements ICryptoAdaptor {
        async getTokensRates() {
          return fakeRates;
        }
      }
      class MockCryptoCacheAdaptor implements ICryptoCacheAdaptor {
        async saveRates(rates: Rates) {
          expect(rates).toEqual(fakeRates);
          return true;
        }
      }

      const domain = new UpdateTokensDomain(new MockCryptoAdaptor(), new MockCryptoCacheAdaptor());

      expect(await domain.updateTokens()).toBeTruthy();
    });

    it('should throw if the token Rate is not returned', async () => {
      class MockCryptoAdaptor implements ICryptoAdaptor {
        async getTokensRates() {
          return undefined;
        }
      }

      class MockCryptoCacheAdaptor implements ICryptoCacheAdaptor {
        rates: Rates[];

        constructor() {
          this.rates = [];
        }

        async saveRates(rates: Rates) {
          this.rates.push(rates);
          return true;
        }
      }

      const cacheAdaptor = new MockCryptoCacheAdaptor();

      const domain = new UpdateTokensDomain(new MockCryptoAdaptor(), cacheAdaptor);

      await expect(domain.updateTokens()).rejects.toThrow();
      expect(cacheAdaptor.rates).toEqual([]);
    });
  });
});
