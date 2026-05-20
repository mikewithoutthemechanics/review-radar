"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingSphere({ position, color, speed, distort }: {
  position: [number, number, number];
  color: string;
  speed: number;
  distort: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.1}
          metalness={0.8}
          distort={distort}
          speed={2}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
}

function WobbleTorus({ position, color }: {
  position: [number, number, number];
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[1.2, 0.4, 16, 32]} />
        <MeshWobbleMaterial
          color={color}
          factor={0.3}
          speed={1}
          roughness={0.2}
          metalness={0.9}
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  );
}

function Particles() {
  const count = 200;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        positions[i * 3] + Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.3,
        positions[i * 3 + 1] + Math.cos(state.clock.elapsedTime * 0.2 + i) * 0.3,
        positions[i * 3 + 2]
      );
      dummy.scale.setScalar(0.02 + Math.sin(state.clock.elapsedTime + i) * 0.01);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#67e8f9" transparent opacity={0.4} />
    </instancedMesh>
  );
}

export function FloatingScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#67e8f9" />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#a78bfa" />

        <FloatingSphere position={[-4, 2, -2]} color="#06b6d4" speed={1.5} distort={0.4} />
        <FloatingSphere position={[4, -1, -3]} color="#8b5cf6" speed={1} distort={0.3} />
        <FloatingSphere position={[0, 3, -4]} color="#3b82f6" speed={0.8} distort={0.5} />
        <WobbleTorus position={[5, 2, -5]} color="#06b6d4" />
        <WobbleTorus position={[-3, -2, -4]} color="#a78bfa" />

        <Particles />
      </Canvas>
    </div>
  );
}
