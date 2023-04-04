import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, SoftShadows } from "@react-three/drei";
import Model from "./Model"; // This is our keyboard model
import { EffectComposer, Bloom } from "@react-three/postprocessing"; // Bloom effects

export default function App(props) {
  return (
    <Canvas
      shadows
      dpr={1}
      gl={{
        powerPreference: "high-performance",
        antialias: false,
        stencil: false,
        depth: false,
      }}
    >
      <SoftShadows samples={20} />
      <Suspense fallback={null}>
        <Model {...props} />
        <EffectComposer multisampling={4} disableNormalPass>
          <Bloom luminanceThreshold={1} intensity={0.8} levels={2} mipmapBlur />
          <Bloom luminanceThreshold={1} intensity={0.3} levels={5} mipmapBlur />
          <Bloom luminanceThreshold={1} intensity={0.1} levels={6} mipmapBlur />
        </EffectComposer>
        {/* <Environment preset='sunset' /> */}
      </Suspense>
    </Canvas>
  );
}
