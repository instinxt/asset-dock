"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center } from "@react-three/drei";

function Model({ url }: { url: string }) {
  const gltf = useGLTF(url);
  return (
    <Center>
      <primitive object={gltf.scene} />
    </Center>
  );
}

export default function ModelViewer({ modelUrl }: { modelUrl: string }) {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Canvas
        camera={{ position: [3, 3, 3], fov: 45 }}
        gl={{ antialias: true }}
        style={{ background: "#18181b" }}
      >
        {/* Ambient base light */}
        <ambientLight intensity={1.2} />
        {/* Key light */}
        <directionalLight position={[5, 8, 5]} intensity={2} castShadow />
        {/* Fill light */}
        <directionalLight position={[-5, 3, -5]} intensity={0.8} />
        {/* Rim light */}
        <directionalLight position={[0, -5, -5]} intensity={0.4} />
        <Suspense fallback={null}>
          <Model url={modelUrl} />
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}
