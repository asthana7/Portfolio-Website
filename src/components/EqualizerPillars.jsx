import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

export default function EqualizerPillars({ activeIndex = 0 }) {
  const groupRef = useRef()

  const pillars = useMemo(() => {
    return new Array(8).fill(0).map((_, i) => ({
      x: i * 0.24,
      seed: Math.random() * 10,
      base: 0.25 + Math.random() * 0.25
    }))
  }, [])

  const colors = ["#f9c97d", "#ff8ad8", "#91cfff", "#c0a2ff"]
  const activeColor = colors[activeIndex % colors.length]

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (groupRef.current) {
      groupRef.current.position.y = 1.05 + Math.sin(t * 0.8) * 0.03
    }

    groupRef.current?.children.forEach((child, i) => {
      const p = pillars[i]
      const value =
        p.base + Math.abs(Math.sin(t * 2.3 + p.seed + activeIndex * 0.6)) * 0.75

      child.scale.y = value
      child.position.y = (value * 0.35) / 2
    })
  })

  return (
    <group ref={groupRef} position={[3.7, 1.05, -1.4]}>
      {pillars.map((pillar, i) => (
        <mesh key={i} position={[pillar.x, 0.15, 0]}>
          <boxGeometry args={[0.11, 0.35, 0.11]} />
          <meshStandardMaterial
            color={activeColor}
            emissive={new THREE.Color(activeColor)}
            emissiveIntensity={0.9}
            transparent
            opacity={0.82}
            roughness={0.25}
          />
        </mesh>
      ))}
    </group>
  )
}