import { DynamoDB } from 'aws-sdk';
import { ICryptoCacheAdaptor, Rates } from '../../UpdateTokensDomain';

class CryptoCacheRepository implements ICryptoCacheAdaptor {
  documentClient: DynamoDB.DocumentClient;

  tableName: string;

  constructor({ documentClient, tableName }) {
    this.documentClient = documentClient;
    this.tableName = tableName;
  }

  async saveRates(rates: Rates) {
    const entries = Object.entries(rates);
    const documents = entries.map(([token, rate]) => ({
      PK: 'rates',
      SK: token,
      rate,
    }));

    await Promise.all(documents.map((document) => this.documentClient.put({
      TableName: this.tableName,
      Item: document,
    }).promise()));

    return true;
  }
}

export default CryptoCacheRepository;
