import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Robot3DProps {
  state?: 'idle' | 'thinking' | 'speaking';
  width?: number;
  height?: number;
}

export const Robot3D: React.FC<Robot3DProps> = ({
  state = 'idle',
  width = 240,
  height = 280,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, -0.05, 3.75);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xf5f5f5, 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(2, 3, 3);
    scene.add(keyLight);

    const purplePoint = new THREE.PointLight(0xe11d48, 3.5, 8);
    purplePoint.position.set(1.5, 0.8, 2.2);
    scene.add(purplePoint);

    const violetRimPoint = new THREE.PointLight(0x9f1239, 3.0, 8);
    violetRimPoint.position.set(-2.0, 1.2, -1.2);
    scene.add(violetRimPoint);

    const pedestalLight = new THREE.PointLight(0xf43f5e, 3.0, 5);
    pedestalLight.position.set(0, -0.85, 0.5);
    scene.add(pedestalLight);

    const whiteArmorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.12,
      roughness: 0.1,
    });

    const darkTechMat = new THREE.MeshStandardMaterial({
      color: 0x151515,
      metalness: 0.85,
      roughness: 0.25,
    });

    const blackVisorMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a0a0a,
      metalness: 0.9,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });

    const cyanNeonMat = new THREE.MeshBasicMaterial({
      color: 0xe11d48,
    });

    const robotRoot = new THREE.Group();
    const headGroup = new THREE.Group();

    const helmetGeo = new THREE.SphereGeometry(0.55, 36, 36);
    helmetGeo.scale(1.02, 0.92, 0.96);
    const helmetMesh = new THREE.Mesh(helmetGeo, whiteArmorMat);
    headGroup.add(helmetMesh);

    const visorGeo = new THREE.SphereGeometry(0.51, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.44);
    visorGeo.rotateX(Math.PI * 0.5);
    visorGeo.scale(0.9, 0.66, 0.44);
    visorGeo.translate(0, 0.02, 0.4);
    const visorMesh = new THREE.Mesh(visorGeo, blackVisorMat);
    headGroup.add(visorMesh);

    const eyeNeonMat = new THREE.MeshBasicMaterial({
      color: 0xe11d48,
      depthTest: false,
    });
    const createSmilingEye = (isLeft: boolean) => {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-0.092, -0.04, 0),
        new THREE.Vector3(0, 0.062, 0),
        new THREE.Vector3(0.092, -0.04, 0)
      );
      const eyeGeo = new THREE.TubeGeometry(curve, 28, 0.04, 14, false);
      const eyeMesh = new THREE.Mesh(eyeGeo, eyeNeonMat);
      eyeMesh.renderOrder = 999;
      eyeMesh.position.set(isLeft ? -0.175 : 0.175, 0.06, 0.62);
      return eyeMesh;
    };
    const leftEye = createSmilingEye(true);
    const rightEye = createSmilingEye(false);
    headGroup.add(leftEye);
    headGroup.add(rightEye);

    const earCupGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.12, 32);
    earCupGeo.rotateZ(Math.PI / 2);

    const leftEar = new THREE.Mesh(earCupGeo, whiteArmorMat);
    leftEar.position.set(-0.56, 0.02, 0);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earCupGeo, whiteArmorMat);
    rightEar.position.set(0.56, 0.02, 0);
    headGroup.add(rightEar);

    const earRingGeo = new THREE.TorusGeometry(0.15, 0.022, 16, 32);
    earRingGeo.rotateY(Math.PI / 2);

    const leftEarRing = new THREE.Mesh(earRingGeo, cyanNeonMat);
    leftEarRing.position.set(-0.63, 0.02, 0);
    headGroup.add(leftEarRing);

    const rightEarRing = new THREE.Mesh(earRingGeo, cyanNeonMat);
    rightEarRing.position.set(0.63, 0.02, 0);
    headGroup.add(rightEarRing);

    headGroup.position.set(0, 0.52, 0);
    robotRoot.add(headGroup);

    const torsoGroup = new THREE.Group();

    const neckGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.15, 24);
    const neckMesh = new THREE.Mesh(neckGeo, darkTechMat);
    neckMesh.position.set(0, 0.22, 0);
    torsoGroup.add(neckMesh);

    const torsoGeo = new THREE.SphereGeometry(0.48, 32, 32);
    torsoGeo.scale(0.85, 1.05, 0.76);
    const torsoMesh = new THREE.Mesh(torsoGeo, whiteArmorMat);
    torsoMesh.position.set(0, -0.16, 0);
    torsoGroup.add(torsoMesh);

    const collarGeo = new THREE.TorusGeometry(0.28, 0.035, 16, 32);
    collarGeo.rotateX(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeo, darkTechMat);
    collarMesh.position.set(0, 0.18, 0);
    torsoGroup.add(collarMesh);

    const chestGroup = new THREE.Group();
    chestGroup.position.set(0, -0.09, 0.36);

    const bezelGeo = new THREE.CylinderGeometry(0.125, 0.125, 0.015, 32);
    bezelGeo.rotateX(Math.PI / 2);
    const bezelMesh = new THREE.Mesh(bezelGeo, darkTechMat);
    chestGroup.add(bezelMesh);

    const ringGeo = new THREE.TorusGeometry(0.115, 0.012, 16, 32);
    const ringMesh = new THREE.Mesh(ringGeo, cyanNeonMat);
    chestGroup.add(ringMesh);

    const starShape = new THREE.Shape();
    const outerR = 0.076;
    const innerR = 0.018;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const r = i % 2 === 0 ? outerR : innerR;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();
    const starGeo = new THREE.ShapeGeometry(starShape);
    const starMesh = new THREE.Mesh(starGeo, cyanNeonMat);
    starMesh.position.set(0, 0, 0.01);
    chestGroup.add(starMesh);

    const whiteCenterGeo = new THREE.CircleGeometry(0.024, 16);
    const whiteCenterMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const whiteCenter = new THREE.Mesh(whiteCenterGeo, whiteCenterMat);
    whiteCenter.position.set(0, 0, 0.012);
    chestGroup.add(whiteCenter);

    const glowCircleGeo = new THREE.CircleGeometry(0.09, 32);
    const glowCircleMat = new THREE.MeshBasicMaterial({
      color: 0xbe123c,
      transparent: true,
      opacity: 0.5,
    });
    const glowCircleMesh = new THREE.Mesh(glowCircleGeo, glowCircleMat);
    glowCircleMesh.position.set(0, 0, 0.004);
    chestGroup.add(glowCircleMesh);

    torsoGroup.add(chestGroup);

    const createWingletArm = (isLeft: boolean) => {
      const armGroup = new THREE.Group();
      const sign = isLeft ? -1 : 1;

      const finGeo = new THREE.SphereGeometry(0.24, 32, 24);
      finGeo.scale(0.44, 1.08, 0.36);
      const finMesh = new THREE.Mesh(finGeo, whiteArmorMat);
      armGroup.add(finMesh);

      const innerGlowGeo = new THREE.SphereGeometry(0.22, 24, 18);
      innerGlowGeo.scale(0.32, 0.96, 0.26);
      innerGlowGeo.translate(-sign * 0.045, 0, 0.02);
      const innerGlowMesh = new THREE.Mesh(innerGlowGeo, cyanNeonMat);
      armGroup.add(innerGlowMesh);

      const socketGeo = new THREE.SphereGeometry(0.07, 16, 16);
      const socketMesh = new THREE.Mesh(socketGeo, darkTechMat);
      socketMesh.position.set(-sign * 0.06, 0.17, 0);
      armGroup.add(socketMesh);

      armGroup.position.set(sign * 0.52, -0.12, 0.08);
      armGroup.rotation.z = sign * -0.22;
      armGroup.rotation.x = 0.1;
      armGroup.rotation.y = sign * 0.16;

      return armGroup;
    };

    const leftArm = createWingletArm(true);
    const rightArm = createWingletArm(false);
    torsoGroup.add(leftArm);
    torsoGroup.add(rightArm);

    const waistRingGeo = new THREE.TorusGeometry(0.72, 0.012, 16, 64);
    const waistRing = new THREE.Mesh(waistRingGeo, cyanNeonMat);
    waistRing.position.set(0, -0.22, 0);
    waistRing.rotation.x = Math.PI * 0.44;
    waistRing.rotation.y = -Math.PI * 0.08;
    torsoGroup.add(waistRing);

    robotRoot.add(torsoGroup);
    scene.add(robotRoot);

    const holoBaseGroup = new THREE.Group();
    holoBaseGroup.position.set(0, -1.05, 0);

    const upperHoloRingGeo = new THREE.TorusGeometry(0.48, 0.014, 16, 64);
    upperHoloRingGeo.rotateX(Math.PI / 2);
    const upperHoloRing = new THREE.Mesh(upperHoloRingGeo, cyanNeonMat);
    upperHoloRing.position.y = 0.32;
    holoBaseGroup.add(upperHoloRing);

    const lowerHoloRingGeo = new THREE.RingGeometry(0.38, 0.44, 64);
    lowerHoloRingGeo.rotateX(-Math.PI / 2);
    const lowerHoloRing = new THREE.Mesh(lowerHoloRingGeo, cyanNeonMat);
    lowerHoloRing.position.y = 0;
    holoBaseGroup.add(lowerHoloRing);

    const coreDiscGeo = new THREE.CircleGeometry(0.24, 32);
    coreDiscGeo.rotateX(-Math.PI / 2);
    const coreDiscMat = new THREE.MeshBasicMaterial({
      color: 0xe11d48,
      transparent: true,
      opacity: 0.55,
    });
    const coreDiscMesh = new THREE.Mesh(coreDiscGeo, coreDiscMat);
    coreDiscMesh.position.y = 0.001;
    holoBaseGroup.add(coreDiscMesh);

    const coneGeo = new THREE.CylinderGeometry(0.48, 0.38, 0.32, 32, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x9f1239,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
    });
    const coneMesh = new THREE.Mesh(coneGeo, coneMat);
    coneMesh.position.y = 0.16;
    holoBaseGroup.add(coneMesh);

    scene.add(holoBaseGroup);

    let animId: number;
    let time = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const speedMult = state === 'thinking' ? 2.0 : state === 'speaking' ? 1.4 : 1.0;
      time += 0.025 * speedMult;

      robotRoot.position.y = Math.sin(time * 0.9) * 0.06;
      robotRoot.rotation.y = Math.sin(time * 0.45) * 0.08;

      headGroup.rotation.y = Math.sin(time * 0.35) * 0.06;
      headGroup.rotation.z = Math.sin(time * 0.4) * 0.02;

      leftArm.rotation.z = -0.22 + Math.sin(time * 1.2) * 0.04;
      rightArm.rotation.z = 0.22 - Math.sin(time * 1.2) * 0.04;

      waistRing.rotation.z -= 0.015 * speedMult;
      waistRing.rotation.y += 0.018 * speedMult;

      upperHoloRing.position.y = 0.32 + Math.sin(time * 1.2) * 0.02;
      upperHoloRing.rotation.z += 0.012;

      const starPulse = 1.0 + Math.sin(time * 2.5) * 0.08;
      starMesh.scale.set(starPulse, starPulse, 1);
      glowCircleMesh.scale.set(starPulse, starPulse, 1);

      const eyeScale = 1.0 + Math.sin(time * 1.5) * 0.04;
      leftEye.scale.set(eyeScale, eyeScale, 1.0);
      rightEye.scale.set(eyeScale, eyeScale, 1.0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [state, width, height]);

  return (
    <div
      ref={mountRef}
      style={{ width, height }}
      className="flex items-center justify-center pointer-events-none select-none drop-shadow-[0_0_35px_rgba(225,29,72,0.25)]"
    />
  );
};
