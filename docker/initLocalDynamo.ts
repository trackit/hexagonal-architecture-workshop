import { DynamoDB, config } from 'aws-sdk';

import { promises as fs } from 'fs';
import { ratesTableProperties } from '@db/index';

const env = {
  RATES_TABLE: 'RATES_TABLE',
  AWS_SECRET_ACCESS_KEY: 'DUMMY_SECRET_KEY',
  AWS_ACCESS_KEY_ID: 'DUMMY_ACCESS_KEY',
  AWS_REGION: 'localhost',
  NODE_ENV: 'test',
};

config.update({
  region: env.AWS_REGION,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: env.AWS_ACCESS_KEY_ID,
});

const dynamodb = new DynamoDB({
  endpoint: 'http://localhost:8000',
});

const createTable = async (params) => {
  await dynamodb.createTable(params).promise();
};

const envValuesToString = (values) => {
  const lines = Object.entries(values).map((value) => value.join('='));
  return lines.join('\n');
};

const createEnv = async ({ name, values }) => {
  const fileContent = envValuesToString(values);
  await fs.writeFile(`./${name}`, fileContent);
  return name;
};

const main = async () => {
  await createTable(ratesTableProperties(env.RATES_TABLE));
  return createEnv({ name: '.env.test', values: env });
};

main().then((name) => {
  console.log(`Environment file created: ${name}`);
}).catch((err) => console.error(err));
