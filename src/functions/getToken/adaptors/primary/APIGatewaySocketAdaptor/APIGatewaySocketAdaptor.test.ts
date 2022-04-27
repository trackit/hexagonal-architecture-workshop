import APIGatewaySocketAdaptor, { GetTokenProxyEvent, ISocketAdaptor } from './APIGatewaySocketAdaptor';
import { IGetTokenDomain } from '../../../GetTokenDomain';

describe('APIGatewaySocketAdaptor', () => {
  const generateEvent: (string) => GetTokenProxyEvent = (body) => ({
    requestContext: {
      routeKey: 'getToken',
      messageId: 'PI-kve9JIAMCKSw=',
      eventType: 'MESSAGE',
      extendedRequestId: 'PI-kvHb1oAMF77Q=',
      requestTime: '17/Mar/2022:18:02:31 +0000',
      messageDirection: 'IN',
      stage: 'dev',
      connectedAt: 1647540147618,
      requestTimeEpoch: 1647540151742,
      identity: {
        sourceIp: '186.114.63.182',
      },
      requestId: 'PI-kvHb1oAMF77Q=',
      domainName: '300axhgkn9.execute-api.us-east-1.amazonaws.com',
      connectionId: 'PI-kGex1IAMCKSw=',
      apiId: '300axhgkn9',
    },
    body: JSON.stringify(body),
    isBase64Encoded: false,
  });

  const mockSocketAdaptorFactory = ({ expectedMessage, expectedConnectionId }) => {
    class SocketAdaptor implements ISocketAdaptor {
      count = 0;

      async sendMessage({ message, connectionId }: { message: string, connectionId: string }) {
        this.count += 1;
        expect(message).toEqual(expectedMessage);
        expect(connectionId).toEqual(expectedConnectionId);
      }
    }

    return new SocketAdaptor();
  };

  it('should send rate in a message to the Socket', async () => {
    const body = {
      action: 'getToken',
      token: 'BTC',
    };
    const event = generateEvent(body);

    class Domain implements IGetTokenDomain {
      cryptoAdaptor: null;

      async getToken(token) {
        expect(token).toEqual(body.token);
        return 12;
      }
    }

    const socketAdaptor = mockSocketAdaptorFactory({
      expectedMessage: '{"success":true,"action":"getToken","data":{"token":"BTC","rate":12}}',
      expectedConnectionId: event.requestContext.connectionId,
    });

    const adaptor = new APIGatewaySocketAdaptor({ domain: new Domain(), socketAdaptor });

    const res = await adaptor.handler(event);
    expect(res).toEqual({ statusCode: 200 });
    expect(socketAdaptor.count).toEqual(1);
  });

  it('should send a specific error message when error starts with "Missing"', async () => {
    const body = {
      action: 'getToken',
      token: 'BTC',
    };

    const event = generateEvent(body);

    class Domain implements IGetTokenDomain {
      cryptoAdaptor: null;

      async getToken() {
        throw new Error('Missing rate');
      }
    }

    const socketAdaptor = mockSocketAdaptorFactory({
      expectedMessage: '{"success":false,"action":"getToken","message":"Token rate not found."}',
      expectedConnectionId: event.requestContext.connectionId,
    });

    const adaptor = new APIGatewaySocketAdaptor({ domain: new Domain(), socketAdaptor });

    const res = await adaptor.handler(event);
    expect(res).toEqual({ statusCode: 200 });
    expect(socketAdaptor.count).toEqual(1);
  });

  it('should send a specific error message when the request does\nt have the token name', async () => {
    const body = {
      action: 'getToken',
    };

    const event = generateEvent(body);

    const socketAdaptor = mockSocketAdaptorFactory({
      expectedMessage: '{"success":false,"action":"getToken","message":"Token name missing."}',
      expectedConnectionId: event.requestContext.connectionId,
    });

    class Domain implements IGetTokenDomain {
      cryptoAdaptor: null;

      async getToken() {
        return undefined;
      }
    }

    const adaptor = new APIGatewaySocketAdaptor({
      domain: new Domain(),
      socketAdaptor,
    });

    const res = await adaptor.handler(event);
    expect(res).toEqual({ statusCode: 200 });
    expect(socketAdaptor.count).toEqual(1);
  });

  it('should send an Internal server error message when error message is unknown', async () => {
    const body = {
      action: 'getToken',
      token: 'SOL',
    };

    const event = generateEvent(body);

    const socketAdaptor = mockSocketAdaptorFactory({
      expectedMessage: '{"success":false,"action":"getToken","message":"Internal server error."}',
      expectedConnectionId: event.requestContext.connectionId,
    });

    class Domain implements IGetTokenDomain {
      cryptoAdaptor: null;

      async getToken() {
        throw new Error();
      }
    }

    const adaptor = new APIGatewaySocketAdaptor({
      domain: new Domain(),
      socketAdaptor,
    });

    await expect(() => adaptor.handler(event)).rejects.toThrow();
    expect(socketAdaptor.count).toEqual(1);
  });
});
