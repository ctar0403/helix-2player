import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.module.js';
import { gameOptions } from './gameOptions.js';

export class Platform extends THREE.Group {
    constructor(posY, hasSpikes) {
        super();

        this.thetaLength = 0;
        this.spikes = [];

        const angle = hasSpikes ? Math.random() * Math.PI * 2 : -Math.PI / 2;

        const material = new THREE.MeshStandardMaterial({
            color: gameOptions.platformColors[Math.floor(Math.random() * gameOptions.platformColors.length)]
        });

        this.thetaLength = hasSpikes
            ? gameOptions.minThetaLength + Math.random() * (gameOptions.maxThetaLength - gameOptions.minThetaLength)
            : Math.PI;

        const cylinderGeometry = new THREE.CylinderGeometry(
            gameOptions.platformRadius,
            gameOptions.platformRadius,
            gameOptions.platformHeight,
            32,
            1,
            false,
            0,
            this.thetaLength
        );

        const cylinder = new THREE.Mesh(cylinderGeometry, material);
        cylinder.castShadow = true;
        cylinder.receiveShadow = true;
        this.add(cylinder);

        const gapMaterial = new THREE.MeshStandardMaterial({
            color: gameOptions.gapColor
        });

        const gapGeometry = new THREE.CylinderGeometry(
            gameOptions.platformRadius,
            gameOptions.platformRadius,
            gameOptions.platformHeight,
            32,
            1,
            false,
            this.thetaLength,
            Math.PI * 2 - this.thetaLength
        );

        const gap = new THREE.Mesh(gapGeometry, gapMaterial);
        gap.castShadow = true;
        gap.receiveShadow = true;
        this.add(gap);

        if (hasSpikes) {
            const spikeStep = Math.PI / 16;
            for (
                let angleSpike = Math.PI / 60;
                angleSpike < this.thetaLength - Math.PI / 60;
                angleSpike += spikeStep
            ) {
                if (Math.random() < gameOptions.spikeProbability) {
                    const spikeGeometry = new THREE.ConeGeometry(
                        gameOptions.spikeRadius,
                        gameOptions.spikeHeight
                    );

                    const spikeMaterial = new THREE.MeshStandardMaterial({
                        color: gameOptions.spikeColor
                    });

                    const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);

                    const jitter = (Math.random() * 4 - 2) * (Math.PI / 180);
                    const finalAngle = angleSpike + jitter;

                    spike.position.x =
                        Math.cos(-finalAngle + Math.PI / 2) *
                        (gameOptions.platformRadius - gameOptions.ballRadius);
                    spike.position.z =
                        Math.sin(-finalAngle + Math.PI / 2) *
                        (gameOptions.platformRadius - gameOptions.ballRadius);
                    spike.position.y =
                        gameOptions.platformHeight / 2 + gameOptions.spikeHeight / 2;

                    spike.castShadow = true;
                    spike.receiveShadow = true;

                    this.add(spike);
                    this.spikes.push(spike);
                }
            }
        }

        this.position.y = posY;
        this.rotation.y = angle;
    }
}
