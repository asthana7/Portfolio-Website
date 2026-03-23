import { useRef, useState } from "react"
import { Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

function CrateRecord({
  label,
  index,
  active,
  onSelect
}) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  const yBase = index * 0.34
  const colors = ["#dca43c", "#513623", "#a883e3", "#5b7885"]
  const labelColor = colors[index % colors.length]

  useFrame(() => {
    if (!ref.current) return

    const lift =
      clicked ? 0.34 :
      active ? 0.2 :
      hovered ? 0.08 : 0

    const pull =
      clicked ? 0.42 :
      active ? 0.18 :
      hovered ? 0.08 : 0

    const rotX = hovered ? -0.08 : 0

    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      yBase + lift,
      0.08
    )

    ref.current.position.z = THREE.MathUtils.lerp(
      ref.current.position.z,
      pull,
      0.08
    )

    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      rotX,
      0.08
    )
  })

  const handleClick = () => {
    setClicked(true)
    window.setTimeout(() => {
      onSelect()
      setClicked(false)
    }, 220)
  }

  return (
    <group
      ref={ref}
      position={[0, yBase, 0]}
      onPointerOver={() => {
        setHovered(true)
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = "default"
      }}
      onClick={(e) => {
        e.stopPropagation()
        handleClick()
      }}
    >
      <mesh castShadow receiveShadow position={[0, 0.02, -0.03]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.05, 48]} />
        <meshStandardMaterial color="#111114" roughness={0.3} metalness={0.18} />
      </mesh>

      <mesh position={[0, 0.02, 0.005]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.052, 32]} />
        <meshStandardMaterial color={labelColor} roughness={0.85} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 0.02, 0.24]}>
        <boxGeometry args={[1.55, 0.28, 0.06]} />
        <meshStandardMaterial
          color={active ? "#8f6bc7" : labelColor}
          roughness={0.8}
        />
      </mesh>

      <mesh position={[0, 0.02, 0.272]}>
        <planeGeometry args={[1.28, 0.16]} />
        <meshBasicMaterial
          color={active ? "#251632" : "#5b4638"}
          transparent
          opacity={0.9}
        />
      </mesh>

      <Text
        position={[0, 0.02, 0.285]}
        fontSize={0.08}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.05}
        textAlign="center"
      >
        {label}
      </Text>
    </group>
  )
}

export default function RecordCrateNav({
  sections,
  activeIndex,
  setActiveIndex,
  setSelectedItemIndex
}) {
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = Math.sin(t * 0.18) * 0.025
  })

  return (
    <group ref={groupRef} position={[4.95, 0.22, 0.62]} rotation={[0, -0.5, 0]}>
      <mesh raycast={() => null} receiveShadow castShadow position={[0, 0.76, -0.26]}>
        <boxGeometry args={[2.45, 2.05, 0.18]} />
        <meshStandardMaterial color="#7b4c34" roughness={0.92} />
      </mesh>

      <mesh raycast={() => null} receiveShadow castShadow position={[0, -0.18, 0]}>
        <boxGeometry args={[2.5, 0.2, 1.2]} />
        <meshStandardMaterial color="#8c5638" roughness={0.92} />
      </mesh>

      <mesh raycast={() => null} receiveShadow castShadow position={[-1.14, 0.44, 0]}>
        <boxGeometry args={[0.16, 1.42, 1.2]} />
        <meshStandardMaterial color="#7f4d33" roughness={0.92} />
      </mesh>

      <mesh rraycast={() => null} eceiveShadow castShadow position={[1.14, 0.44, 0]}>
        <boxGeometry args={[0.16, 1.42, 1.2]} />
        <meshStandardMaterial color="#7f4d33" roughness={0.92} />
      </mesh>

      <mesh raycast={() => null} receiveShadow castShadow position={[0, 0.02, 0.48]}>
        <boxGeometry args={[2.5, 0.52, 0.16]} />
        <meshStandardMaterial color="#74442d" roughness={0.92} />
      </mesh>

      <group position={[0, 0, 0.2]}>
        {sections.map((section, index) => (
          <CrateRecord
            key={section.id}
            label={section.title}
            index={index}
            active={index === activeIndex}
            onSelect={() => {
              setActiveIndex(index)
              setSelectedItemIndex(0)
            }}
          />
        ))}
      </group>
    </group>
  )
}