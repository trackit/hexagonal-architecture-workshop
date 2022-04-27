import handlerPath from '@libs/handlerResolver';

export const getTokenHTTP = {
  handler: `${handlerPath(__dirname)}/handlers/handlerHTTP.main`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/tokens/{token}',
      },
    },
  ],
};

export const getTokenWebSocket = {
  handler: `${handlerPath(__dirname)}/handlers/handlerWebSocket.main`,
  events: [
    {
      websocket: {
        route: 'getToken',
      },
    },
  ],
};
