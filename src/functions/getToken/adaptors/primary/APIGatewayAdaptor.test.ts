import APIGatewayAdaptor from './APIGatewayAdaptor';
import { IGetTokenDomain } from '../../GetTokenDomain';

describe('APIGatewayAdaptor', () => {
  const generateEvent = (pathParameters) => ({
    version: '2.0',
    routeKey: 'GET /tokens/{token}',
    rawPath: '/tokens/BTC',
    rawQueryString: '',
    headers: {
      accept: '*/*',
      'accept-encoding': 'gzip, deflate, br',
      'content-length': '0',
      host: 'gk5ez4burc.execute-api.us-east-1.amazonaws.com',
      'postman-token': 'e9ade030-9226-4f3b-b755-2926c50acb26',
      'user-agent': 'PostmanRuntime/7.26.8',
      'x-amzn-trace-id': 'Root=1-622a4a74-1f7f14d17a9678366738ea90',
      'x-forwarded-for': '186.114.63.182',
      'x-forwarded-port': '443',
      'x-forwarded-proto': 'https',
    },
    requestContext: {
      accountId: '522548170624',
      apiId: 'gk5ez4burc',
      domainName: 'gk5ez4burc.execute-api.us-east-1.amazonaws.com',
      domainPrefix: 'gk5ez4burc',
      http: {
        method: 'GET',
        path: '/tokens/BTC',
        protocol: 'HTTP/1.1',
        sourceIp: '186.114.63.182',
        userAgent: 'PostmanRuntime/7.26.8',
      },
      requestId: 'OyCSShz7IAMESrg=',
      routeKey: 'GET /tokens/{token}',
      stage: '$default',
      time: '10/Mar/2022:18:59:00 +0000',
      timeEpoch: 1646938740874,
    },
    pathParameters,
    isBase64Encoded: false,
  });

  it('should return the rate returned by the domain', async () => {
    const pathParameters = {
      token: 'BTC',
    };
    class Domain implements IGetTokenDomain {
      cryptoAdaptor: null;

      async getToken(token) {
        expect(token).toEqual(pathParameters.token);
        return 12;
      }
    }

    const adaptor = new APIGatewayAdaptor(new Domain());

    expect(await adaptor.handler(generateEvent(pathParameters))).toEqual({
      statusCode: 200,
      body: '{"token":"BTC","rate":12}',
    });
  });

  it('should return 404 when error message starts with "Missing"', async () => {
    const pathParameters = {
      token: 'ETH',
    };
    class Domain implements IGetTokenDomain {
      cryptoAdaptor: null;

      async getToken() {
        throw new Error('Missing rate');
      }
    }

    const adaptor = new APIGatewayAdaptor(new Domain());

    expect(await adaptor.handler(generateEvent(pathParameters))).toEqual({
      statusCode: 404,
      body: '{\"message\":\"Token rate not found.\"}',
    });
  });

  it('should return 400 when the request does\nt have the token name', async () => {
    const pathParameters = {};
    class Domain implements IGetTokenDomain {
      cryptoAdaptor: null;

      async getToken() {
        return undefined;
      }
    }

    const adaptor = new APIGatewayAdaptor(new Domain());

    expect(await adaptor.handler(generateEvent(pathParameters))).toEqual({
      statusCode: 400,
      body: '{\"message\":\"Token name missing.\"}',
    });
  });

  it('should return 500 when error message is unknown', async () => {
    const pathParameters = { token: 'SOL' };
    class Domain implements IGetTokenDomain {
      cryptoAdaptor: null;

      async getToken() {
        throw new Error();
      }
    }

    const adaptor = new APIGatewayAdaptor(new Domain());

    expect(await adaptor.handler(generateEvent(pathParameters))).toEqual({
      statusCode: 500,
      body: '{\"message\":\"Internal server error.\"}',
    });
  });
});
