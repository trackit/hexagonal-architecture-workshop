import APIGatewayClientAdaptor from './APIGatewayClientAdaptor';

describe('APIGatewayClientAdaptor', () => {
  describe('sendMessage', () => {
    it('should forward the parameters to APIGateway', async () => {
      const sendMessageParams = {
        message: 'tot',
        connectionId: '123456',
      };
      class MockAPIGatewayClient {
        count = 0;

        postToConnection({
          ConnectionId,
          Data,
        }) {
          this.count += 1;
          expect(ConnectionId).toEqual(sendMessageParams.connectionId);
          expect(Data).toEqual(sendMessageParams.message);
          return {
            promise: () => {},
          };
        }
      }
      const apiGatewayClient = new MockAPIGatewayClient();
      const socketAdaptor = new APIGatewayClientAdaptor(apiGatewayClient as any);

      await socketAdaptor.sendMessage(sendMessageParams);
      expect(apiGatewayClient.count).toEqual(1);
    });
  });
});
