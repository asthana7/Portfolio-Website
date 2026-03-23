import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

export default function CameraRig({ activeIndex = 0 }) {
  const { camera } = useThree()
  const lookAt = new THREE.Vector3(1.2, 0.8, 0)

  useFrame((state) => {
    const t = state.clock.elapsedTime

    const baseX = -1.2
    const baseY = 3.4
    const baseZ = 8.6

    const sectionShiftX = [0, 0.08, -0.06, 0.04][activeIndex] ?? 0
    const sectionShiftY = [0, 0.03, 0.02, -0.02][activeIndex] ?? 0

    const driftX = Math.sin(t * 0.12) * 0.12
    const driftY = Math.sin(t * 0.18) * 0.04

    const targetX = baseX + sectionShiftX + Math.sin(t * 0.18) * 0.08 + driftX
    const targetY = baseY + sectionShiftY + Math.sin(t * 0.24) * 0.04 + driftY
    const targetZ = baseZ + Math.cos(t * 0.16) * 0.06

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.03)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.03)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.03)
    camera.lookAt(lookAt)

    state.camera.position.x += (Math.sin(t * 0.12) * 0.12 - state.camera.position.x) * 0.02
    state.camera.position.y += (3.4 + Math.sin(t * 0.18) * 0.04 - state.camera.position.y) * 0.02
    state.camera.lookAt(0, 0.9, 0)

  })

  return null
}