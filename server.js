
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

let clients = [], players = [];

wss.on('connection', function connection(ws) {
  let matchId = null, playerId = null, opponentId = null;

  const clientId = clients.length;
  clients.push(ws);
  console.log("connected.")

  ws.on('message', function incoming(message) {
    const msg = JSON.parse(message);

    if (msg.type === 'join') {
      playerId = msg.playerId;
      players.push(playerId);
      console.log(playerId + " joined.")

      // create new room
      if (clients.length % 2 == 1) {
        matchId = (clients.length + 1) / 2;
        clients[clientId].send(JSON.stringify({ type: 'init', matchId : matchId }));
        console.log("room" + matchId + " created.")
      }
      // join existing room
      else {
        matchId = clients.length / 2;
        opponentId = players[clientId-1];
        clients[clientId].send(JSON.stringify({ type : 'start', matchId : matchId, opponentId : opponentId}))
        clients[clientId - 1].send(JSON.stringify({ type : 'start', matchId: matchId, opponentId : playerId}))
        console.log("game started in room" + matchId);
      }
    } else if (msg.type === 'update') {
      
    }
  });

  ws.on('close', () => {
    clients = clients.filter(p => p !== ws);
    players = players.filter(p => p !== playerId);
    console.log(playerId + " closed.")
  });
});

console.log('WebSocket server started on ws://localhost:3000');
