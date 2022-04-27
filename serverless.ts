import type { AWS } from '@serverless/typescript';
import {
  connectWebSocket, defaultWebSocket, disconnectWebSocket, getTokenHTTP, getTokenWebSocket, updateTokens,
} from './src/functions';
import { ratesTableProperties } from './src/db';

const serverlessConfiguration: AWS = {
  service: 'hexagonal-serverless-workshop',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    httpApi: {
      cors: true,
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      COIN_LAYER_ACCESS_KEY: process.env.COIN_LAYER_ACCESS_KEY,
      RATES_TABLE: '${self:custom.ratesTable}',
      WEBSOCKET_ENDPOINT: {
        'Fn::Join': [
          '',
          [
            { Ref: 'WebsocketsApi' },
            '.execute-api.',
            { Ref: 'AWS::Region' },
            '.',
            { Ref: 'AWS::URLSuffix' },
            "/${opt:stage, self:provider.stage, 'dev'}",
          ],
        ],
      },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:GetItem',
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:BatchGetItem',
              'dynamodb:BatchWriteItem',
            ],
            Resource: [
              { 'Fn::GetAtt': ['RatesTable', 'Arn'] },
            ],
          },
        ],
      },
    },
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    ratesTable: "HEXAGONAL_WORKSHOP_RATES_TABLE_${opt:stage, self:provider.stage, 'dev'}",
  },
  // import the function via paths
  functions: {
    getTokenHTTP, getTokenWebSocket, updateTokens, connectWebSocket, defaultWebSocket, disconnectWebSocket,
  },
  resources: {
    Resources: {
      RatesTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: ratesTableProperties('${self:custom.ratesTable}'),
      },
    },
  },
  package: { individually: true },
};

module.exports = serverlessConfiguration;
