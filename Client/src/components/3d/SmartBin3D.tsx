"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Float, ContactShadows, Environment, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

// Re-trigger build
function SmartBinModel(props: any) {
    const group = useRef<THREE.Group>(null);
    const [hovered, setHover] = useState(false);

    // Auto-rotate gently, faster on hover
    useFrame((state, delta) => {
        if (group.current) {
            group.current.rotation.y += delta * (hovered ? 0.5 : 0.2);
        }
    });

    return (
        <group ref={group} {...props} dispose={null}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            {/* --- Main Body (Metallic Shell) --- */}
            <RoundedBox args={[2.5, 5, 2.5]} radius={0.3} smoothness={4} position={[0, 0, 0]}>
                <meshStandardMaterial
                    color="#222"
                    metalness={0.8}
                    roughness={0.2}
                />
            </RoundedBox>

            {/* --- Front Panel (Darker Glass/Plastic) --- */}
            <RoundedBox args={[2.2, 4.8, 0.2]} radius={0.1} position={[0, 0, 1.2]}>
                <meshStandardMaterial color="#111" metalness={0.5} roughness={0.1} />
            </RoundedBox>

            {/* --- Scanner Opening (The Mouth) --- */}
            <group position={[0, 1, 1.3]}>
                {/* Rim */}
                <RoundedBox args={[1.8, 1, 0.1]} radius={0.4} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#444" metalness={0.9} roughness={0.1} />
                </RoundedBox>
                {/* Inner Glow (The Void) */}
                <RoundedBox args={[1.6, 0.8, 0.1]} radius={0.35} position={[0, 0, 0.05]}>
                    <meshBasicMaterial color="#10b981" toneMapped={false} />
                </RoundedBox>
                {/* Scanner Light Beam Effect */}
                <pointLight color="#10b981" intensity={2} distance={3} decay={2} />
            </group>

            {/* --- Top Cap (Sensor Array) --- */}
            <RoundedBox args={[2.5, 0.2, 2.5]} radius={0.1} position={[0, 2.6, 0]}>
                <meshStandardMaterial color="#333" metalness={0.6} roughness={0.3} />
            </RoundedBox>
            {/* Sensor Dot */}
            <mesh position={[0, 2.75, 0]}>
                <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
                <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2} />
            </mesh>

            {/* --- Side Accents (Emerald Strips) --- */}
            <RoundedBox args={[0.1, 4, 0.1]} radius={0.05} position={[1.26, 0, 0]}>
                <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1} />
            </RoundedBox>
            <RoundedBox args={[0.1, 4, 0.1]} radius={0.05} position={[-1.26, 0, 0]}>
                <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1} />
            </RoundedBox>

        </group>
    );
}

export default function SmartBin3D() {
    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#10b981" />

                <Environment preset="city" />

                <Float
                    speed={2} // Animation speed
                    rotationIntensity={0.5} // XYZ rotation intensity
                    floatIntensity={1} // Up/down float intensity
                >
                    <SmartBinModel />
                </Float>

                <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
            </Canvas>
        </div>
    );
}
