"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function Model({ url, scale = 1, rotation = [0, 0, 0], autoRotate = true, floatSpeed = 1.5 }: {
  url: string;
  scale?: number;
  rotation?: [number, number, number];
  autoRotate?: boolean;
  floatSpeed?: number;
}) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={floatSpeed} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={groupRef} rotation={rotation as unknown as THREE.Euler} scale={scale}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

function SceneLighting({ mood }: { mood: "danger" | "solution" | "growth" | "data" }) {
  const colors = {
    danger: { ambient: "#1a0505", directional: "#ff3333", point: "#ff6666" },
    solution: { ambient: "#051a1a", directional: "#06b6d4", point: "#67e8f9" },
    growth: { ambient: "#051a0a", directional: "#10b981", point: "#6ee7b7" },
    data: { ambient: "#0a051a", directional: "#8b5cf6", point: "#a78bfa" },
  };

  const c = colors[mood];

  return (
    <>
      <ambientLight intensity={0.4} color={c.ambient} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} color={c.directional} />
      <pointLight position={[-3, 3, 3]} intensity={0.6} color={c.point} />
      <pointLight position={[3, -2, -3]} intensity={0.3} color={c.directional} />
    </>
  );
}

export function ModelViewer({ modelUrl, mood = "solution", scale = 1, rotation, autoRotate, className = "" }: {
  modelUrl: string;
  mood?: "danger" | "solution" | "growth" | "data";
  scale?: number;
  rotation?: [number, number, number];
  autoRotate?: boolean;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className={`${className} bg-transparent`} />;

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 1, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        fallback={null}
      >
        <SceneLighting mood={mood} />
        <Suspense fallback={null}>
          <Model
            url={modelUrl}
            scale={scale}
            rotation={rotation}
            autoRotate={autoRotate}
          />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
