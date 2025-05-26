export class NetworkManager {
  constructor(socket) {
    this.socket = socket;
    this.playerId = null;
    this.opponentId = null;
    this.onPlayerUpdate = () => {};
    this.onStart = () => {};

    socket.addEventListener('open', () => {
      console.log('Connected to server');
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'start') {
        this.playerId = data.playerId;
        this.opponentId = data.opponentId;
        this.onStart(this.playerId, this.opponentId);
      } else if (data.type === 'update') {
        if (data.playerId !== this.playerId) {
          this.onPlayerUpdate(data.playerId, data.position);
        }
      }
    });
  }

  sendPosition(position) {
    this.socket.send(JSON.stringify({
      type: 'update',
      playerId: this.playerId,
      position: position,
    }));
  }
}