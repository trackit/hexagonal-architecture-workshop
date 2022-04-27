import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { IGetTokenDomain, IInvoker } from '../../GetTokenDomain';

export type GetTokenProxyEvent =
    Omit<APIGatewayProxyEventV2, 'pathParameters'>
    & { pathParameters: { token: string } };
export type GetTokenProxyResult = APIGatewayProxyResultV2;

export default class APIGatewayAdaptor implements IInvoker {
  domain: IGetTokenDomain;

  constructor(domain) {
    this.domain = domain;
  }

  static formatResponse(statusCode, body) {
    return {
      statusCode,
      body: JSON.stringify(body),
    };
  }

  async handler(event: GetTokenProxyEvent): Promise<GetTokenProxyResult> {
    try {
      const { token } = event.pathParameters;
      if (token === undefined) {
        return APIGatewayAdaptor.formatResponse(400, {
          message: 'Token name missing.',
        });
      }
      const rate = await this.domain.getToken(token);

      return APIGatewayAdaptor.formatResponse(200, {
        token,
        rate,
      });
    } catch (e) {
      if (e.message.startsWith('Missing')) {
        return APIGatewayAdaptor.formatResponse(404, {
          message: 'Token rate not found.',
        });
      }
      return APIGatewayAdaptor.formatResponse(500, {
        message: 'Internal server error.',
      });
    }
  }
}
