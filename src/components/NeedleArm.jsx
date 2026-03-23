// import { useEffect, useRef } from "react"
// import { useFrame } from "@react-three/fiber"
// import * as THREE from "three"

// export default function NeedleArm({ activeIndex }) {
//   const pivotRef = useRef()
//   const targetRef = useRef(-0.42)

//   useEffect(() => {
//     const positions = [-0.42, -0.24, -0.06, 0.1]
//     targetRef.current = positions[activeIndex] ?? -0.42
//   }, [activeIndex])

//   useFrame(() => {
//     if (!pivotRef.current) return

//     pivotRef.current.rotation.y = THREE.MathUtils.lerp(
//       pivotRef.current.rotation.y,
//       targetRef.current,
//       0.06
//     )
//   })

//   return (
//     <group ref={pivotRef} position={[2.65, 0.38, 2.15]}>
//       <mesh castShadow position={[-1.65, 0, -1.65]}>
//         <boxGeometry args={[3.5, 0.09, 0.14]} />
//         <meshStandardMaterial color="#efe7d8" metalness={0.15} roughness={0.58} />
//       </mesh>

//       <mesh castShadow position={[-3.1, -0.05, -3.1]}>
//         <boxGeometry args={[0.36, 0.2, 0.25]} />
//         <meshStandardMaterial color="#221d24" />
//       </mesh>
//     </group>
//   )
// }

import { useEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function NeedleArm({ activeIndex }) {
  const pivotRef = useRef()
  const armRef = useRef()

  const targetRotationRef = useRef(-0.42)
  const liftRef = useRef(0)
  const phaseRef = useRef("idle")
  const timerRef = useRef(0)

  useEffect(() => {
    const positions = [-0.42, -0.26, -0.11, 0.02]
    targetRotationRef.current = positions[activeIndex] ?? -0.42

    phaseRef.current = "lift"
    timerRef.current = 0
  }, [activeIndex])

  useFrame((_, delta) => {
    if (!pivotRef.current || !armRef.current) return

    timerRef.current += delta

    if (phaseRef.current === "lift") {
      liftRef.current = THREE.MathUtils.lerp(liftRef.current, 0.22, 0.08)
      pivotRef.current.rotation.y = THREE.MathUtils.lerp(
        pivotRef.current.rotation.y,
        targetRotationRef.current,
        0.04
      )

      if (timerRef.current > 0.32) {
        phaseRef.current = "drop"
      }
    } else if (phaseRef.current === "drop") {
      liftRef.current = THREE.MathUtils.lerp(liftRef.current, 0, 0.08)
      pivotRef.current.rotation.y = THREE.MathUtils.lerp(
        pivotRef.current.rotation.y,
        targetRotationRef.current,
        0.08
      )

      if (Math.abs(liftRef.current) < 0.01) {
        phaseRef.current = "idle"
      }
    } else {
      liftRef.current = THREE.MathUtils.lerp(liftRef.current, 0, 0.05)
      pivotRef.current.rotation.y = THREE.MathUtils.lerp(
        pivotRef.current.rotation.y,
        targetRotationRef.current,
        0.06
      )
    }

    armRef.current.position.y = liftRef.current
    armRef.current.rotation.z = -liftRef.current * 0.35
  })

  return (
    <group ref={pivotRef} position={[2.65, 0.38, 2.15]}>
      <group ref={armRef}>
        <mesh castShadow position={[-1.65, 0, -1.65]}>
          <boxGeometry args={[3.5, 0.09, 0.14]} />
          <meshStandardMaterial color="#efe7d8" metalness={0.15} roughness={0.58} />
        </mesh>

        <mesh castShadow position={[-3.1, -0.05, -3.1]}>
          <boxGeometry args={[0.36, 0.2, 0.25]} />
          <meshStandardMaterial color="#221d24" />
        </mesh>
      </group>
    </group>
  )
}