import fetch from 'node-fetch';
import { DynamoDB } from 'aws-sdk';
import { Handler } from 'aws-lambda';
import EventBridgeAdaptor from './adaptors/primary/EventBridgeAdaptor';
import RequestAdaptor from './adaptors/secondary/RequestAdaptor';
import CoinLayerAdaptor from './adaptors/secondary/CoinLayerAdaptor';
import UpdateTokensDomain from './UpdateTokensDomain';
import CryptoRatesRepository from './adaptors/secondary/CryptoRatesRepository';

// ---- Secondary Adaptors ---- //
const requestAdaptor = new RequestAdaptor(fetch);

const cryptoAdaptor = new CoinLayerAdaptor(requestAdaptor, process.env.COIN_LAYER_ACCESS_KEY);

const documentClient = new DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
});

const cacheAdaptor = new CryptoRatesRepository({
  documentClient,
  tableName: process.env.RATES_TABLE,
});

// ---- Domain ---- //
const updateTokenDomain = new UpdateTokensDomain(cryptoAdaptor, cacheAdaptor);

// ---- Primary Adaptors ---- //
const apiGatewayAdaptor = new EventBridgeAdaptor(updateTokenDomain);

type GetTokenHandler = Handler<undefined, boolean>;

export const main: GetTokenHandler = async () => apiGatewayAdaptor.handler();
