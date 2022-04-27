import { ApiGatewayManagementApi } from 'aws-sdk';
import { ISocketAdaptor } from './APIGatewaySocketAdaptor';

interface IApiGatewayClient {
  postToConnection: InstanceType<typeof ApiGatewayManagementApi>['postToConnection']
}

class APIGatewayClientAdaptor implements ISocketAdaptor {
  apiGatewayClient: IApiGatewayClient;

  constructor(apiGatewayClient: IApiGatewayClient) {
    this.apiGatewayClient = apiGatewayClient;
  }

  async sendMessage({ message, connectionId }: { message: string, connectionId: string }) {
    await this.apiGatewayClient.postToConnection({
      ConnectionId: connectionId,
      Data: message,
    }).promise();
  }
}

export default APIGatewayClientAdaptor;
