import { WebSocket } from 'ws';

const tokens = [
  'BTC', 'ABC', 'ETH', 'PIZZA', 'MKR', 'PBT',
];

const getRandomIndex = (size) => {
  const randomNumber = Math.round(Math.random() * 10000);

  return randomNumber % size;
};

const callForToken = (socket) => {
  const index = getRandomIndex(tokens.length);
  const token = tokens[index];
  console.log(`Calling service to get ${token}.`);
  socket.send(JSON.stringify({
    action: 'getToken',
    token,
  }));
};

const logEvery2Seconds = (socket: WebSocket) => {
  callForToken(socket);
  setTimeout(() => {
    callForToken(socket);
    logEvery2Seconds(socket);
  }, 100000);
};

const main = () => {
  const socket = new WebSocket('wss://300axhgkn9.execute-api.us-east-1.amazonaws.com/dev');
  socket.on('open', () => {
    logEvery2Seconds(socket);
  });
  socket.on('message', (event) => {
    console.log('message', JSON.parse(event.toString()));
  });
};

main();
