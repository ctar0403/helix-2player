
# Helix Jump Two Player Game (WebSocket + Three.js)

## How to Run

1. **Install dependencies** (for WebSocket server):
```bash
npm install ws
```

2. **Start the server**:
```bash
node server.js
```

3. **Open Game**:
Open two browser tabs:

```
http://localhost:3000/index.html?playerId=player1
http://localhost:3000/index.html?playerId=player2
```

Each player will control their own environment (left side), and see the opponent's on the right side.

## Notes

- Player states are synchronized using WebSocket.
- Scene contains platforms and ball (basic Helix Jump style).
- All logic lives in `main.js` and `game.js`.

Enjoy!
