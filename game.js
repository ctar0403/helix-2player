// game.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.module.js';
import { Ball } from './ball.js';
import { Platform } from './platform.js';
import { gameOptions } from './gameOptions.js';

let sceneLocal, sceneRemote, cameraLocal, cameraRemote, rendererLocal, rendererRemote;
let player, opponent;
let opponentState = {};
let platformsLocal = [], platformsRemote = [];
let playerVelocity = 0;
const gravity = -0.005;

export function initGame() {
  // Scenes
  sceneLocal = new THREE.Scene();
  sceneRemote = new THREE.Scene();
  sceneLocal.background = new THREE.Color(0x202020);
  sceneRemote.background = new THREE.Color(0x202020);

  // Lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  const directional = new THREE.DirectionalLight(0xffffff, 1);
  directional.position.set(5, 10, 7.5);
  sceneLocal.add(ambient.clone(), directional.clone());
  sceneRemote.add(ambient.clone(), directional.clone());

  // Cameras
  cameraLocal = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight / 2, 0.1, 1000);
  cameraRemote = cameraLocal.clone();
  cameraLocal.position.z = 10;
  cameraRemote.position.z = 10;

  // Renderers
  rendererLocal = new THREE.WebGLRenderer({ canvas: document.getElementById('left') });
  rendererRemote = new THREE.WebGLRenderer({ canvas: document.getElementById('right') });
  rendererLocal.setSize(window.innerWidth / 2, window.innerHeight);
  rendererRemote.setSize(window.innerWidth / 2, window.innerHeight);

  // Balls
  player = new Ball(sceneLocal, gameOptions, 0x00ff00);
  opponent = new Ball(sceneRemote, gameOptions, 0xff0000);
  // player.material.color.set(0x00ff00);
  // opponent.material.color.set(0xff0000);
  player.position.y = 3;
  opponent.position.y = 3;
  sceneLocal.add(player.mesh);
  sceneRemote.add(opponent.mesh);

  // Platforms
  for (let i = 0; i < 10; i++) {
    const y = -i * 3;
    const hasSpikes = Math.random() < 0.5;
    const pLocal = new Platform(y, hasSpikes);
    const pRemote = new Platform(y, hasSpikes);
    platformsLocal.push(pLocal);
    platformsRemote.push(pRemote);
    sceneLocal.add(pLocal);
    sceneRemote.add(pRemote);
  }
}

export function updateGame() {
  // Apply gravity
  playerVelocity += gravity;
  player.position.y += playerVelocity;

  // Platform collision (local)
  platformsLocal.forEach(platform => {
    const dy = player.position.y - platform.position.y;
    if (dy < gameOptions.platformHeight / 2 + gameOptions.ballRadius &&
        dy > -gameOptions.platformHeight / 2 &&
        Math.abs(playerVelocity) > 0.001) {

      const ballAngle = Math.atan2(player.position.z, player.position.x);
      const localAngle = ((ballAngle - platform.rotation.y + 2 * Math.PI) % (2 * Math.PI));

      if (localAngle <= platform.thetaLength) {
        player.position.y = platform.position.y + gameOptions.platformHeight / 2 + gameOptions.ballRadius;
        playerVelocity = 0;
      }

      // Check spikes
      platform.spikes.forEach(spike => {
        const dx = player.position.x - spike.position.x;
        const dz = player.position.z - spike.position.z;
        const distSq = dx * dx + dz * dz;
        if (distSq < gameOptions.spikeRadius * gameOptions.spikeRadius) {
          player.material.color.set(0xffff00);
        }
      });
    }
  });

  // Update opponent state
  if (opponentState.y !== undefined) {
    opponent.position.y = opponentState.y;
    opponent.rotation.y = opponentState.rotationY || 0;
  }

  cameraLocal.position.y = player.position.y + 5;
  cameraLocal.lookAt(player.position.x, player.position.y, player.position.z);

  cameraRemote.position.y = opponent.position.y + 5;
  cameraRemote.lookAt(opponent.position.x, opponent.position.y, opponent.position.z);

  rendererLocal.render(sceneLocal, cameraLocal);
  rendererRemote.render(sceneRemote, cameraRemote);
}

export function updateOpponentState(state) {
  opponentState = state;
}

export function getLocalPlayerState() {
  return {
    y: player.position.y,
    rotationY: player.rotation.y
  };
}


let isDragging = false;
let lastMouseX = 0;
let rotationSpeed = 0.005;

export function handleLocalInput() {
  const canvas = rendererLocal.domElement;

  canvas.addEventListener('mousedown', (event) => {
    isDragging = true;
    lastMouseX = event.clientX;
  });

  canvas.addEventListener('mousemove', (event) => {
    if (!isDragging) return;
    const deltaX = event.clientX - lastMouseX;
    lastMouseX = event.clientX;
    player.rotation.y -= deltaX * rotationSpeed;
  });

  canvas.addEventListener('mouseup', () => {
    isDragging = false;
  });

  canvas.addEventListener('mouseleave', () => {
    isDragging = false;
  });
}
