export default (tableName: string) => ({
  TableName: tableName,
  AttributeDefinitions: [
    {
      AttributeName: 'PK',
      AttributeType: 'S',
    },
    {
      AttributeName: 'SK',
      AttributeType: 'S',
    },
  ],
  KeySchema: [
    {
      AttributeName: 'PK',
      KeyType: 'HASH',
    },
    {
      AttributeName: 'SK',
      KeyType: 'RANGE',
    },
  ],
  BillingMode: 'PAY_PER_REQUEST',
});
