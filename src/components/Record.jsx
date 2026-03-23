import { Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"

export default function Record({ activeSection, activeIndex }) {
  const groupRef = useRef()
  const labelMatRef = useRef()
  const speedRef = useRef(0)
  const targetSpeedRef = useRef(0.82)
  const [readyToSpin, setReadyToSpin] = useState(false)
  const isDraggingRef = useRef(false)
  const lastPointerXRef = useRef(0)
  const dragVelocityRef = useRef(0)

  const grooves = useMemo(() => {
    const values = []
    for (let i = 0; i < 22; i++) {
      values.push(1.18 + i * 0.095)
    }
    return values
  }, [])

  useEffect(() => {
    if (!readyToSpin) return
    speedRef.current = 0.08
    targetSpeedRef.current = 0.82
  }, [activeIndex, readyToSpin])

  useEffect(() => {
  const handlePointerUp = () => {
    isDraggingRef.current = false
    document.body.style.cursor = "default"
  }

  window.addEventListener("pointerup", handlePointerUp)
  return () => window.removeEventListener("pointerup", handlePointerUp)
}, [])



  useFrame((_, delta) => {
    if (!groupRef.current) return

    if (!readyToSpin) {
      const targetY = 0.24
      const targetX = 0.2

      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05)
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.04)
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.04)

      if (
        Math.abs(groupRef.current.position.y - targetY) < 0.02 &&
        Math.abs(groupRef.current.position.x - targetX) < 0.02
      ) {
        setReadyToSpin(true)
        speedRef.current = 0.82
      }
    } else {
      if (isDraggingRef.current) {
        speedRef.current = THREE.MathUtils.lerp(speedRef.current, dragVelocityRef.current, 0.18)
      } else {
        speedRef.current = THREE.MathUtils.lerp(speedRef.current, targetSpeedRef.current, 0.035)
      }
    

  groupRef.current.rotation.y += delta * speedRef.current





  
}
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      Math.sin(speedRef.current * 0.8) * 0.003,
      0.04
    )
  })


  return (
    <group
      ref={groupRef}
      position={[-1.4, 1.3, 0]}
      rotation={[0, 0, 0.22]}
      onPointerDown={(e) => {
        e.stopPropagation()
        isDraggingRef.current = true
        lastPointerXRef.current = e.clientX
        dragVelocityRef.current = speedRef.current
        document.body.style.cursor = "grabbing"
      }}
      onPointerMove={(e) => {
        if (!isDraggingRef.current) return
        e.stopPropagation()

        const deltaX = e.clientX - lastPointerXRef.current
        lastPointerXRef.current = e.clientX

        dragVelocityRef.current = THREE.MathUtils.clamp(deltaX * 0.018, -4.5, 4.5)
      }}
      onPointerUp={(e) => {
        e.stopPropagation()
        isDraggingRef.current = false
        document.body.style.cursor = "grab"
      }}
      onPointerLeave={() => {
        if (!isDraggingRef.current) {
          document.body.style.cursor = "default"
        }
      }}
      onPointerEnter={() => {
        if (readyToSpin && !isDraggingRef.current) {
          document.body.style.cursor = "grab"
        }
      }}
    >
      <mesh receiveShadow position={[0, -0.09, 0]}>
        <cylinderGeometry args={[3.5, 3.5, 0.24, 90]} />
        <meshStandardMaterial color="#2c2629" metalness={0.3} roughness={0.42} />
      </mesh>

      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.08, 128]} />
        <meshStandardMaterial color="#111114" metalness={0.22} roughness={0.18} />
      </mesh>

      {grooves.map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <ringGeometry args={[radius, radius + 0.012, 128]} />
          <meshBasicMaterial color="#1e1a22" side={THREE.DoubleSide} />
        </mesh>
      ))}

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.051, 0]}>
        <ringGeometry args={[1.2, 3.0, 128]} />
        <meshBasicMaterial
          color={activeSection?.theme?.waveformColor || "#2c3e70"}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 0.055, 0]}>
        <cylinderGeometry args={[0.92, 0.92, 0.09, 64]} />
        <meshStandardMaterial
          ref={labelMatRef}
          color={activeSection?.theme?.labelColor || "#f1e7d6"}
          roughness={0.92}
        />
      </mesh>

      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.22, 24]} />
        <meshStandardMaterial color="#c7a97f" metalness={0.75} roughness={0.22} />
      </mesh>

      <Text
        position={[0, 0.16, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        fontSize={0.17}
        color={activeSection?.theme?.labelText || "#221710"}
        maxWidth={1.15}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {`ANANYA
ASTHANA

${activeSection?.side || "SIDE A"}
${activeSection?.track || "TRACK 01"}

${activeSection?.title || "About Me"}`}
      </Text>
    </group>
  )
}