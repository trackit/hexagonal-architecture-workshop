import fetch from 'node-fetch';
import { Handler } from 'aws-lambda';
import APIGatewayAdaptor, { GetTokenProxyEvent, GetTokenProxyResult } from '../adaptors/primary/APIGatewayAdaptor';
import RequestAdaptor from '../adaptors/secondary/RequestAdaptor';
import CoinLayerAdaptor from '../adaptors/secondary/CoinLayerAdaptor';
import GetTokenDomain from '../GetTokenDomain';

// ---- Secondary Adaptors ---- //
const requestAdaptor = new RequestAdaptor(fetch);

const cryptoAdaptor = new CoinLayerAdaptor(requestAdaptor, process.env.COIN_LAYER_ACCESS_KEY);

// ---- Domain ---- //
const getTokenDomain = new GetTokenDomain(cryptoAdaptor);

// ---- Primary Adaptors ---- //
const apiGatewayAdaptor = new APIGatewayAdaptor(getTokenDomain);

type GetTokenHandler = Handler<GetTokenProxyEvent, GetTokenProxyResult>;

export const main: GetTokenHandler = async (
  event,
) => apiGatewayAdaptor.handler(event);
