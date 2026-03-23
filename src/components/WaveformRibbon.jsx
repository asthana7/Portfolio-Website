
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

export default function WaveformRibbon({ activeIndex = 0, activeSection }) {
  const groupRef = useRef()

  const points = useMemo(() => {
    const arr = []
    const count = 120

    for (let i = 0; i < count; i++) {
      const x = (i - count / 2) * 0.12
      const seed = Math.random() * Math.PI * 2
      const offset = Math.random() * 0.25
      arr.push({ x, seed, offset })
    }

    return arr
  }, [])

  const colors = ["#b388ff", "#ff8ad8", "#7dd3fc", "#ffd39a"]
  // const activeColor = colors[activeIndex % colors.length]
  const activeColor = activeSection?.theme?.waveformColor || "#b388ff"

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (groupRef.current) {
      groupRef.current.position.y = 2.75 + Math.sin(t * 0.45) * 0.04
      groupRef.current.rotation.z = Math.sin(t * 0.16) * 0.01
    }

    groupRef.current?.children.forEach((child, i) => {
      if (i >= points.length) return

      const p = points[i]
      const y =
        Math.sin(p.x * 0.8 + t * 1.8 + activeIndex * 0.7 + p.seed) * 0.18 +
        Math.sin(p.x * 0.28 + t * 0.9 + p.seed) * 0.08

      const scale =
        0.75 +
        Math.sin(t * 2 + p.seed + i * 0.04) * 0.12 +
        p.offset

      child.position.y = y
      child.scale.setScalar(Math.max(0.4, scale))
    })
  })

  return (
    <group ref={groupRef} position={[1.5, 2.75, -2.3]}>
      {points.map((point, i) => (
        <mesh key={i} position={[point.x, 0, 0]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial
            color={activeColor}
            emissive={new THREE.Color(activeColor)}
            emissiveIntensity={1.9}
            transparent
            opacity={0.9}
            roughness={0.25}
          />
        </mesh>
      ))}

      <mesh position={[0, 0, -0.2]}>
        <planeGeometry args={[15, 2.2]} />
        <meshBasicMaterial
          color={activeColor}
          transparent
          opacity={0.05}
        />
      </mesh>
    </group>
  )
}