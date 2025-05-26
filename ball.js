import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.module.js';
import { gameOptions } from './gameOptions';  

export class Ball {
    constructor(scene, options, color) {
        this.scene = scene;
        this.options = options;

        const geometry = new THREE.SphereGeometry(gameOptions.ballRadius, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: color });
        // super(geometry, material);
        this.mesh = new THREE.Mesh(geometry, material);

        this.scene.add(this.mesh);
    }

    get position() {
        return this.mesh.position;
    }

    get rotation() {
        return this.mesh.rotation;
    }

    update() {
        this.rotation.x += this.options.rotationSpeed;
        this.rotation.y += this.options.rotationSpeed;
    }
}
