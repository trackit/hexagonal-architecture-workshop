import { DynamoDB } from 'aws-sdk';
import CryptoCacheRepository from './CryptoRatesRepository';

describe('CryptoCacheRepository', () => {
  const localDocumentClient = new DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  });

  const tableName = process.env.RATES_TABLE;

  describe('saveRates', () => {
    const getSavedRates = async () => {
      const response = await localDocumentClient.query({
        TableName: tableName,
        KeyConditionExpression: 'PK = :PK',
        ExpressionAttributeValues: {
          ':PK': 'rates',
        },
      }).promise();

      return response.Items;
    };

    afterAll(async () => {
      const documents = await getSavedRates();
      await Promise.all(documents.map(({ PK, SK }) => localDocumentClient.delete({
        TableName: tableName,
        Key: {
          PK,
          SK,
        },
      }).promise()));
    });

    it('should save the rates in the Table', async () => {
      const rates = {
        BTC: 100,
        ETH: 10,
      };

      const repository = new CryptoCacheRepository({
        documentClient: localDocumentClient,
        tableName,
      });

      expect(await repository.saveRates(rates)).toBeTruthy();

      const savedRates = await getSavedRates();

      expect(savedRates).toEqual([
        {
          PK: 'rates',
          SK: 'BTC',
          rate: 100,
        },
        {
          PK: 'rates',
          SK: 'ETH',
          rate: 10,
        },
      ]);
    });
  });
});
