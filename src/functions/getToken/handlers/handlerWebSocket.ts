import fetch from 'node-fetch';
import { ApiGatewayManagementApi } from 'aws-sdk';
import { Handler } from 'aws-lambda';
import APIGatewayClientAdaptor from '../adaptors/primary/APIGatewaySocketAdaptor/APIGatewayClientAdaptor';
import APIGatewaySocketAdaptor, {
  GetTokenProxyEvent,
} from '../adaptors/primary/APIGatewaySocketAdaptor/APIGatewaySocketAdaptor';
import RequestAdaptor from '../adaptors/secondary/RequestAdaptor';
import CoinLayerAdaptor from '../adaptors/secondary/CoinLayerAdaptor';
import GetTokenDomain from '../GetTokenDomain';

// ---- Secondary Adaptors ---- //
const requestAdaptor = new RequestAdaptor(fetch);

const cryptoAdaptor = new CoinLayerAdaptor(requestAdaptor, process.env.COIN_LAYER_ACCESS_KEY);

// ---- Domain ---- //
const domain = new GetTokenDomain(cryptoAdaptor);

// ---- Primary Adaptors ---- //
const apiGatewayClient = new ApiGatewayManagementApi({ endpoint: process.env.WEBSOCKET_ENDPOINT });

const socketAdaptor = new APIGatewayClientAdaptor(apiGatewayClient);

const apiGatewayAdaptor = new APIGatewaySocketAdaptor({
  domain,
  socketAdaptor,
});

type GetTokenHandler = Handler<GetTokenProxyEvent, any>;

export const main: GetTokenHandler = async (
  event,
) => apiGatewayAdaptor.handler(event);
