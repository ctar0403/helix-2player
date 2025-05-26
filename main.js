import {
  initGame,
  updateGame,
  updateOpponentState,
  getLocalPlayerState,
  handleLocalInput
} from './game.js';

const params = new URLSearchParams(window.location.search);
let matchId, opponentId;
const playerId = params.get('playerId');

let socket = new WebSocket('ws://localhost:3000');
console.log("connecting...");

socket.onopen = () => {
  socket.send(JSON.stringify({ type: 'join', playerId }));
};

socket.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.type === 'init') {
    matchId = msg.matchId;
    document.getElementById('waiting').innerText = `Connecting in room ${matchId}...`;
  } else if (msg.type === 'start') {
    matchId = msg.matchId;
    opponentId = msg.opponentId;
    document.getElementById('waiting').innerText = `Connected in room ${matchId} with ${opponentId}`;
    initGame();
    handleLocalInput();
    animate();
  } else if (msg.type === 'state') {
    updateOpponentState(msg.state);
  }
};

function animate() {
  requestAnimationFrame(animate);
  updateGame();
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'state',
      playerId,
      state: getLocalPlayerState()
    }));
  }
}
