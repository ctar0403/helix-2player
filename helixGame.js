import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.module.js';

export class HelixGame {
  constructor(canvas) {
    this.canvas = canvas;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    this.isGameOver = false;

    this.towerRotation = 0;
    this.ballPosition = new THREE.Vector3(0, 8, 0);
    this.ballSpeed = -5; // falling speed

    this._setupScene();
  }

  _setupScene() {
    // Simple helix tower: stack rings with gaps for the ball to fall
    const geometry = new THREE.TorusGeometry(3, 0.5, 16, 100);
    const material = new THREE.MeshBasicMaterial({ color: 0x0077ff });

    this.rings = [];
    const gap = 2;
    for (let i = 0; i < 10; i++) {
      const ring = new THREE.Mesh(geometry, material);
      ring.position.y = i * gap;
      this.scene.add(ring);
      this.rings.push(ring);
    }

    // Ball
    const ballGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const ballMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    this.ball = new THREE.Mesh(ballGeo, ballMat);
    this.scene.add(this.ball);
  }

  rotateTower(amount) {
    this.towerRotation += amount;
    // Clamp rotation or loop?
  }

  syncState(state) {
    // Sync rotation and ball position from opponent
    this.towerRotation = state.rotation ?? this.towerRotation;
    this.ballPosition.y = state.ballY ?? this.ballPosition.y;
  }

  startGame() {
    this.isGameOver = false;
    this.ballPosition.set(0, 8, 0);
    this.towerRotation = 0;
  }

  endGame() {
    this.isGameOver = true;
  }

  update(delta) {
    if (this.isGameOver) return;

    this.ballPosition.y += this.ballSpeed * delta;
    if (this.ballPosition.y < 0) {
      this.isGameOver = true;
    }

    // Update ball position in 3D space, considering tower rotation
    this.ball.position.set(
      Math.sin(this.towerRotation) * 3,
      this.ballPosition.y,
      Math.cos(this.towerRotation) * 3
    );

    // Rotate all rings around Y-axis
    this.rings.forEach(ring => {
      ring.rotation.y = this.towerRotation;
    });
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
