import {
  APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';
import { IGetTokenDomain, IInvoker } from '../../../GetTokenDomain';

export type GetTokenProxyEvent = {
  requestContext: {
    routeKey: string,
    messageId: string,
    eventType: string,
    extendedRequestId: string,
    requestTime: string,
    messageDirection: string,
    stage: string,
    connectedAt: number,
    requestTimeEpoch: number,
    identity: {
      sourceIp: string
    },
    requestId: string,
    domainName: string,
    connectionId: string,
    apiId: string
  },
  body: string,
  isBase64Encoded: boolean
};

export type GetTokenProxyResult = APIGatewayProxyStructuredResultV2;

export interface ISocketAdaptor {
  sendMessage: ({ message, connectionId }: { message: string, connectionId: string }) => Promise<void>
}

export default class APIGatewaySocketAdaptor implements IInvoker {
  domain: IGetTokenDomain;

  socketAdaptor: ISocketAdaptor;

  constructor({ domain, socketAdaptor }) {
    this.domain = domain;
    this.socketAdaptor = socketAdaptor;
  }

  static formatErrorMessage(message) {
    return JSON.stringify({
      success: false,
      action: 'getToken',
      message,
    });
  }

  static formatMessage(data) {
    return JSON.stringify({
      success: true,
      action: 'getToken',
      data,
    });
  }

  async handler({ body, requestContext: { connectionId } }: GetTokenProxyEvent): Promise<GetTokenProxyResult> {
    const defaultResponse = {
      statusCode: 200,
    };
    try {
      const { token } = JSON.parse(body);
      if (token === undefined) {
        await this.socketAdaptor.sendMessage({
          message: APIGatewaySocketAdaptor.formatErrorMessage('Token name missing.'),
          connectionId,
        });
        return defaultResponse;
      }

      const rate = await this.domain.getToken(token);

      await this.socketAdaptor.sendMessage({
        message: APIGatewaySocketAdaptor.formatMessage({
          token,
          rate,
        }),
        connectionId,
      });
    } catch (e) {
      if (e.message.startsWith('Missing')) {
        await this.socketAdaptor.sendMessage({
          message: APIGatewaySocketAdaptor.formatErrorMessage('Token rate not found.'),
          connectionId,
        });
        return defaultResponse;
      }
      await this.socketAdaptor.sendMessage({
        message: APIGatewaySocketAdaptor.formatErrorMessage('Internal server error.'),
        connectionId,
      });
      throw e;
    }
    return defaultResponse;
  }
}
