import handlerPath from '@libs/handlerResolver';

export const connectWebSocket = {
  handler: `${handlerPath(__dirname)}/handlers.connectHandler`,
  events: [
    {
      websocket: {
        route: '$connect',
      },
    },
  ],
};

export const defaultWebSocket = {
  handler: `${handlerPath(__dirname)}/handlers.connectHandler`,
  events: [
    {
      websocket: {
        route: '$default',
      },
    },
  ],
};

export const disconnectWebSocket = {
  handler: `${handlerPath(__dirname)}/handlers.connectHandler`,
  events: [
    {
      websocket: {
        route: '$disconnect',
      },
    },
  ],
};
