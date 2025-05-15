📌 Key Concepts
Helix Jump: The player controls a bouncing ball falling through rotating platforms (helix tower).

Two-Player Mode: Each player plays in their own environment, but can see the opponent’s state (ball position, score).

Synchronization: Only key state variables (e.g. ball position, rotation) are shared through WebSocket.

UI Split: Left side = player’s game, right side = opponent’s mirrored simulation.

🧭 ROADMAP / WORKFLOW
STEP 1 — Project Structure
Organize your project like this:

cpp
Copy
Edit
/public
  index.html
/src
  main.js           // Entry point
  helixGame.js      // 3D logic, animation, game physics
  network.js        // WebSocket connection and sync
  utils.js          // (Optional) math or helper functions
STEP 2 — Design the Game Logic
2.1 Create the Helix Tower
Build a central cylinder as the core.

Add rotating platforms stacked vertically, each with a gap.

Platforms rotate slowly over time.

Use THREE.Mesh with BoxGeometry or TorusGeometry to simulate slices.

2.2 Add the Ball
A simple bouncing ball using SphereGeometry.

Ball falls under gravity.

On collision with a platform, bounce up or fall through the gap.

On hitting a platform edge too hard, it’s game over.

2.3 Physics & Movement
Simulate gravity (manual y-position adjustment).

Detect collisions with platforms.

Rotate tower on input (mouse/touch drag = rotate tower, not ball).

STEP 3 — Multiplayer Architecture
3.1 WebSocket Setup
Each player connects with a matchId, playerId, and opponentId.

When both players are connected, start the game.

Send/receive only necessary data (ball position, score, game over flag).

3.2 Game State Sync
Use a NetworkHandler class:

.sendState() → send local state every frame (e.g. { y: 12.3, score: 10 })

.onReceive() → update opponent simulation

STEP 4 — Rendering Two Views
4.1 Canvas Split
index.html should contain two canvases:

Left for local player

Right for opponent simulation

Each canvas should have its own renderer, scene, camera.

4.2 Mirrored Environment
Both players simulate the same tower layout.

Left side is live gameplay.

Right side mimics opponent's state updates.

Opponent simulation does not run full physics — it just shows movement.

STEP 5 — Game Flow & Lifecycle
On page load:

Parse query params: matchId, playerId, opponentId.

Connect WebSocket.

Initialize both scenes (left + right).

Once both players are connected:

Start animation loop.

Local player updates physics and rendering.

Remote player updates opponent rendering from received data.

On game over:

Notify opponent via WebSocket.

Send result to parent iframe via postMessage.

🧪 Core Components Overview
A. helixGame.js
Builds 3D environment

Handles physics, input, animation

Contains two sets of objects (local and remote)

Provides functions:

initGame()

updateLocalState()

applyOpponentState(state)

render()

B. network.js
Connects to WebSocket server

Handles message sending/receiving

Invokes callbacks:

onReady(side)

onReceive(state)

C. main.js
Initializes everything

Manages animation loop

Sends/receives game state

Handles game start and end

📱 Embedded Mode (Iframe Integration)
Game runs inside an iframe.

When the game ends, use:

js
Copy
Edit
parent.postMessage({
  type: 'match_result',
  payload: {
    matchId,
    playerId,
    opponentId,
    outcome: 'won' | 'lost' | 'draw',
    score: playerScore
  }
}, '*');
🧩 Multiplayer WebSocket API (Suggested Format)
Client connects: wss://yourserver.com/socket?matchId=xyz&playerId=1

Messages sent:

json
Copy
Edit
{
  "matchId": "xyz",
  "from": "1",
  "to": "2",
  "state": { "y": 10.2, "score": 3 }
}
Server routes message to the correct opponent.

✨ Optional Enhancements
Real-time score display

Avatar icons or colors

Sound effects

Anti-cheating (e.g. input-based sync, not state-based)

Leaderboards and match history

🧠 Summary
Area	Responsibility
Three.js	Game visuals and physics
WebSocket	Real-time multiplayer sync
Canvas Split	Player left, opponent right view
State Sync	Minimal — ball Y position, rotation, score
Iframe API	postMessage() to parent with match result
