import { Stars } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

function GlowOrb({ position, color, scale = 1, opacity = 0.12 }) {
  const ref = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (!ref.current) return

    ref.current.position.y += Math.sin(t * 0.2 + position[0]) * 0.0008
    ref.current.rotation.z += 0.0007
  })

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  )
}

export default function CosmicBackground() {
  return (
    <>
      <Stars
        radius={100}
        depth={45}
        count={4500}
        factor={3.4}
        saturation={0}
        fade
        speed={0.45}
      />

      <GlowOrb position={[-8, 5, -16]} color="#7c4dff" scale={5.5} opacity={0.14} />
      <GlowOrb position={[8, 3, -14]} color="#ff6ec7" scale={4.5} opacity={0.12} />
      <GlowOrb position={[0, -1, -18]} color="#4fc3f7" scale={5.2} opacity={0.1} />
      <GlowOrb position={[-3, 6, -12]} color="#ffd180" scale={2.8} opacity={0.1} />
    </>
  )
}