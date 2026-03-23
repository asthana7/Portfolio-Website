import { Text, Html } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

function Sleeve({
  item,
  index,
  total,
  isSelected,
  isOpen,
  onClick,
  entranceProgressRef
}) {
  const groupRef = useRef()

  const coverPivotRef = useRef()
  const coverMeshRef = useRef()
  const coverDetailsRef = useRef()

  const spreadRef = useRef()
  const spreadMatLeftRef = useRef()
  const spreadMatRightRef = useRef()
  const spineMatRef = useRef()

  const [hovered, setHovered] = useState(false)
  const [showInsideText, setShowInsideText] = useState(false)
  const openT = useRef(0)

  const spread = 0.58
  const start = -((total - 1) * spread) / 2

  let finalX = start + index * spread

  if (index === total - 1) {
    finalX -= 0.08
  }

  let finalRotZ = (index - (total - 1) / 2) * 0.035

  if (index === total - 1) {
    finalRotZ -= 0.02
  }

  const finalBaseZ = -index * 0.12

  // const localDelay = index * 0.14
  // const t = Math.max(0, Math.min(1, (entranceProgress - localDelay) / 0.86))

  useEffect(() => {
    let timeoutId
    if (isOpen) {
      timeoutId = setTimeout(() => setShowInsideText(true), 180)
    } else {
      setShowInsideText(false)
    }
    return () => clearTimeout(timeoutId)
  }, [isOpen])

  useFrame(() => {
    if (
      !groupRef.current ||
      !coverPivotRef.current ||
      !coverMeshRef.current ||
      !spreadRef.current
    ) {
      return
    }
    const localDelay = index * 0.14
    const entranceProgress = entranceProgressRef.current
    const t = Math.max(0, Math.min(1, (entranceProgress - localDelay) / 0.86))

    openT.current = THREE.MathUtils.lerp(openT.current, isOpen ? 1 : 0, 0.1)
    const o = openT.current

    const entranceX = THREE.MathUtils.lerp(1.8, finalX, t)
    const entranceY = THREE.MathUtils.lerp(-0.18, 0, t)
    const entranceZ = THREE.MathUtils.lerp(0.55, finalBaseZ, t)
    const entranceRotZ = THREE.MathUtils.lerp(0.02, finalRotZ, t)

    const targetY = entranceY + (hovered || isSelected ? 0.05 : 0)
    const targetZ = entranceZ + (isOpen ? 1.24 : isSelected ? 1.08 : hovered ? 0.08 : -0.38)
    const targetX = isOpen ? 0.18 : isSelected ? 0.1 : 0
    const targetRotY = isOpen ? 0.012 : isSelected ? -0.04 : hovered ? -0.02 : 0.03
    const targetRotX = hovered ? -0.015 : 0
    const targetScale = isOpen ? 1.1 : isSelected ? 1.08 : hovered ? 0.93 : 0.87

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      entranceX + targetX,
      0.09
    )
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      0.09
    )
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetZ,
      0.09
    )

    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      entranceRotZ,
      0.09
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      0.09
    )
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      0.09
    )

    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.09)
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale, 0.09)
    groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, targetScale, 0.09)

    // keep spread stable and aligned
    spreadRef.current.position.z = THREE.MathUtils.lerp(
      spreadRef.current.position.z,
      0.012,
      0.08
    )

    if (spreadMatLeftRef.current) {
      spreadMatLeftRef.current.opacity = THREE.MathUtils.lerp(
        spreadMatLeftRef.current.opacity,
        o,
        0.08
      )
    }

    if (spreadMatRightRef.current) {
      spreadMatRightRef.current.opacity = THREE.MathUtils.lerp(
        spreadMatRightRef.current.opacity,
        o,
        0.08
      )
    }

    if (spineMatRef.current) {
      spineMatRef.current.opacity = THREE.MathUtils.lerp(
        spineMatRef.current.opacity,
        0.25 + o * 0.5,
        0.08
      )
    }

    // front cover physically opens, then moves behind and left so it stops cutting through the spread
    coverPivotRef.current.rotation.y = THREE.MathUtils.lerp(
      coverPivotRef.current.rotation.y,
      -1.0 * o,
      0.08
    )

    coverPivotRef.current.position.x = THREE.MathUtils.lerp(
      coverPivotRef.current.position.x,
      -0.14 * o,
      0.08
    )

    coverPivotRef.current.position.z = THREE.MathUtils.lerp(
      coverPivotRef.current.position.z,
      0.055 - 0.12 * o,
      0.08
    )

    // hide all cover art/details once mostly open
    if (coverDetailsRef.current) {
      coverDetailsRef.current.visible = o < 0.55
    }

    // fully hide the whole cover object once almost fully open
    coverPivotRef.current.visible = !(isOpen && o > 0.88)
  })

  return (
    <group ref={groupRef} position={[1.8, -0.18, 0.55]} rotation={[0, 0, 0.02]}>
      {/* aligned inside spread */}
      <group ref={spreadRef} position={[0, 0, 0.012]}>
        <mesh position={[0, 0, 0]} raycast={() => null}>
          <boxGeometry args={[0.012, 1.62, 0.022]} />
          <meshStandardMaterial
            ref={spineMatRef}
            color="#ddd2be"
            roughness={0.95}
            transparent
            opacity={0.25}
          />
        </mesh>

        {/* left page */}
        <group position={[-0.548, 0, 0]}>
          <mesh castShadow receiveShadow raycast={() => null}>
            <boxGeometry args={[1.14, 1.6, 0.03]} />
            <meshStandardMaterial
              ref={spreadMatLeftRef}
              color="#0c1e4d"
              roughness={0.96}
              transparent
              opacity={0}
              polygonOffset
              polygonOffsetFactor={1}
              polygonOffsetUnits={1}
            />
          </mesh>

          <mesh position={[0, 0, 0.018]} raycast={() => null}>
            <planeGeometry args={[0.94, 1.36]} />
            <meshBasicMaterial
              color="white"
              transparent
              opacity={0.08}
              depthWrite={false}
            />
          </mesh>

          <mesh position={[0, 0.48, 0.019]} raycast={() => null}>
            <planeGeometry args={[0.24, 0.03]} />
            <meshBasicMaterial
              color={item.accent || "white"}
              transparent
              opacity={0.35}
              depthWrite={false}
            />
          </mesh>

          <mesh position={[0.27, 0.44, 0.019]} raycast={() => null}>
            <circleGeometry args={[0.015, 18]} />
            <meshBasicMaterial
              color="white"
              transparent
              opacity={0.22}
              depthWrite={false}
            />
          </mesh>

          {showInsideText && (
            <>
              <Text
                position={[0, 0.34, 0.02]}
                fontSize={0.06}
                color="white"
                anchorX="center"
                anchorY="middle"
                maxWidth={0.74}
                textAlign="center"
                raycast={() => null}
              >
                {item.period}
              </Text>

              <Text
                position={[0, 0.12, 0.02]}
                fontSize={0.065}
                color="white"
                anchorX="center"
                anchorY="middle"
                maxWidth={0.76}
                textAlign="center"
                raycast={() => null}
              >
                {item.title}
              </Text>

              <Text
                position={[0, -0.12, 0.02]}
                fontSize={0.06}
                color="white"
                anchorX="center"
                anchorY="middle"
                maxWidth={0.8}
                textAlign="center"
                raycast={() => null}
              >
                {item.subtitle}
              </Text>

              <Text
                position={[0, -0.42, 0.02]}
                fontSize={0.06}
                color="white"
                anchorX="center"
                anchorY="middle"
                maxWidth={0.74}
                lineHeight={1.45}
                textAlign="center"
                raycast={() => null}
              >
                {item.summary}
              </Text>
            </>
          )}
        </group>



        {/* right page */}
      <group position={[0.548, 0, 0]}>
        <mesh castShadow receiveShadow raycast={() => null}>
          <boxGeometry args={[1.14, 1.6, 0.03]} />
          <meshStandardMaterial
            ref={spreadMatRightRef}
            color="#0c1e4d"
            roughness={0.96}
            transparent
            opacity={0}
            polygonOffset
            polygonOffsetFactor={1}
            polygonOffsetUnits={1}
          />
        </mesh>

        <mesh position={[0, 0, 0.018]} raycast={() => null}>
          <planeGeometry args={[0.94, 1.36]} />
          <meshBasicMaterial
            color="white"
            transparent
            opacity={0.08}
            depthWrite={false}
          />
        </mesh>

        <mesh position={[0, 0.46, 0.019]} raycast={() => null}>
          <planeGeometry args={[0.3, 0.02]} />
          <meshBasicMaterial
            color={item.accent || "white"}
            transparent
            opacity={0.24}
            depthWrite={false}
          />
        </mesh>

        <mesh position={[0, -0.26, 0.019]} raycast={() => null}>
          <planeGeometry args={[0.4, 0.014]} />
          <meshBasicMaterial
            color={item.accent || "white"}
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </mesh>

        {showInsideText && (
          <>
            <Text
              position={[0, 0.16, 0.02]}
              fontSize={0.065}
              color="white"
              anchorX="center"
              anchorY="middle"
              maxWidth={0.72}
              lineHeight={1.42}
              textAlign="center"
              raycast={() => null}
            >
              {item.details.slice(0, 2).join("\n\n")}
            </Text>

            <Text
              position={[0, -0.46, 0.02]}
              fontSize={0.06}
              color="white"
              anchorX="center"
              anchorY="middle"
              maxWidth={0.72}
              textAlign="center"
              raycast={() => null}
            >
              {item.labelLine}
            </Text>
          </>
        )}
      </group>

      {/* front cover */}
      <group ref={coverPivotRef} position={[0, 0, 0.055]}>
        <group position={[-0.548, 0, 0]}>
          <Html
            position={[0, 0, 0.12]}
            center
            style={{
              pointerEvents: "auto",
              width: "170px",
              height: "245px",
              transform: "translate(-50%, -50%)"
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onClick()
              }}
              onMouseEnter={() => {
                setHovered(true)
                document.body.style.cursor = "pointer"
              }}
              onMouseLeave={() => {
                setHovered(false)
                document.body.style.cursor = "default"
              }}
              style={{
                width: "100%",
                height: "100%",
                background: "transparent",
                border: "none",
                padding: 0,
                margin: 0,
                cursor: "pointer",
                outline: "none",
                boxShadow: "none"
              }}
              aria-label={`Open ${item.title}`}
            />
          </Html>

          <mesh ref={coverMeshRef} castShadow receiveShadow>
            <boxGeometry args={[1.18, 1.64, 0.06]} />
            <meshStandardMaterial
              color={item.color}
              roughness={0.92}
              metalness={0}
              emissive={hovered ? item.accent || "#8b5cf6" : "#000000"}
              emissiveIntensity={hovered ? 0.18 : 0}
            />
          </mesh>

          <group ref={coverDetailsRef}>
            {/* inner frame */}
            <mesh position={[0, 0, 0.031]} raycast={() => null}>
              <planeGeometry args={[0.92, 1.34]} />
              <meshBasicMaterial
                color="#f2ecff"
                transparent
                opacity={0.05}
                polygonOffset
                polygonOffsetFactor={-1}
              />
            </mesh>

            {/* top badge */}
            <mesh position={[0, 0.54, 0.032]} raycast={() => null}>
              <planeGeometry args={[0.5, 0.12]} />
              <meshBasicMaterial color={item.accent || "#9fd3e8"} />
            </mesh>

            <mesh position={[0, 0, 0.032]} raycast={() => null}>
              <planeGeometry args={[0.9, 1.34]} />
              <meshBasicMaterial
                color={item.accent || "#b9c7ff"}
                transparent
                opacity={0.06}
              />
            </mesh>

            <Text
              position={[0, 0.54, 0.04]}
              fontSize={0.05}
              color="#102018"
              anchorX="center"
              anchorY="middle"
              maxWidth={0.46}
              textAlign="center"
              raycast={() => null}
            >
              {item.badge || "PROJECT"}
            </Text>

            {/* celestial ring motif */}
            <mesh position={[0.2, 0.18, 0.032]} rotation={[0, 0, 0.35]} raycast={() => null}>
              <planeGeometry args={[0.32, 0.32]} />
              <meshBasicMaterial
                color="#cbb7ff"
                transparent
                opacity={0.08}
                depthWrite={false}
              />
            </mesh>

            <mesh position={[-0.16, -0.05, 0.032]} rotation={[0, 0, -0.2]} raycast={() => null}>
              <planeGeometry args={[0.14, 0.14]} />
              <meshBasicMaterial color="#e6ddff" transparent opacity={0.08} />
            </mesh>

            <mesh position={[0.28, -0.22, 0.032]} raycast={() => null}>
              <circleGeometry args={[0.018, 18]} />
               <meshBasicMaterial
                color="#f4ecff"
                transparent
                opacity={0.08}
                depthWrite={false}
              />
            </mesh>

            <mesh position={[0.04, 0.12, 0.032]} rotation={[0, 0, 0.5]} raycast={() => null}>
              <planeGeometry args={[0.6, 0.18]} />
              <meshBasicMaterial color="#d0c2ff" transparent opacity={0.05} />
            </mesh>

            <mesh position={[-0.1, -0.18, 0.032]} rotation={[0, 0, -0.65]} raycast={() => null}>
              <planeGeometry args={[0.48, 0.14]} />
              <meshBasicMaterial color="#a7d7ff" transparent opacity={0.05} />
            </mesh>

            <mesh position={[0.16, -0.02, 0.032]} rotation={[0, 0, 0.12]} raycast={() => null}>
              <planeGeometry args={[0.38, 0.1]} />
              <meshBasicMaterial color="#f0e8ff" transparent opacity={0.04} />
            </mesh>

            {/* title */}
            <Text
              position={[0, 0.25, 0.04]}
              fontSize={0.08}
              color="#f6f0e8"
              anchorX="center"
              anchorY="middle"
              maxWidth={0.86}
              textAlign="center"
              raycast={() => null}
            >
              {item.title}
            </Text>

            {/* subtitle */}
            <Text
              position={[0, -0.06, 0.04]}
              fontSize={0.084}
              color="#d9d1c7"
              anchorX="center"
              anchorY="middle"
              maxWidth={0.78}
              textAlign="center"
              raycast={() => null}
            >
              {item.subtitle}
            </Text>

            {/* label line */}
            <Text
              position={[0, -0.38, 0.04]}
              fontSize={0.06}
              color="#c8c0b6"
              anchorX="center"
              anchorY="middle"
              maxWidth={0.82}
              textAlign="center"
              raycast={() => null}
            >
              {item.labelLine}
            </Text>

            {/* bottom strip */}
            <mesh position={[0, -0.66, 0.032]} raycast={() => null}>
              <planeGeometry args={[0.72, 0.055]} />
              <meshBasicMaterial color={item.accent || "pink"} />
            </mesh>

            <Text
              position={[0, -0.56, 0.04]}
              fontSize={0.06}
              color="#f1ebe2"
              anchorX="center"
              anchorY="middle"
              raycast={() => null}
            >
              {item.period}
            </Text>

            {isSelected && !isOpen && (
              <Text
                position={[0, -0.76, 0.04]}
                fontSize={0.057}
                color="#b8afa5"
                anchorX="center"
                anchorY="middle"
                raycast={() => null}
              >
                Click to learn more
              </Text>
            )}
          </group>
        </group>
      </group>
    </group>
    </group>
  )
}

export default function ContentSleeves({
  items = [],
  visible = false,
  selectedItemIndex = 0,
  setSelectedItemIndex,
  isSleeveOpen,
  setIsSleeveOpen
}) {
  const groupRef = useRef()
  const entranceProgressRef = useRef(0)

  useEffect(() => {
    if (!visible) return
    entranceProgressRef.current = 0
    document.body.style.cursor = "default"
    return () => {
      document.body.style.cursor = "default"
    }
  }, [visible, items])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = Math.sin(t * 0.16) * 0.02
    groupRef.current.position.y = 1.00 + Math.sin(t * 0.6) * 0.012
    // const targetScale = hovered ? 1.02 : 1
    // const targetY = hovered ? 0.05 : 0

    // mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.1)
    // mesh.position.y += (targetY - mesh.position.y) * 0.1

   entranceProgressRef.current = Math.min(1.4, entranceProgressRef.current + delta * 1.35)
  })

  if (!items.length) return null

  return (
    <group ref={groupRef} position={[2., 1.0, 0.28]} rotation={[0.02, -0.8, 0]}>
      {!isSleeveOpen && (
        <Text
          position={[0.15, 1.45, 0.25]}
          fontSize={0.15}
          color="#f8f1e7"
          anchorX="center"
          anchorY="middle"
          maxWidth={3.4}
          textAlign="center"
          raycast={() => null}
        >
          CLICK THE ALBUM SLEEVE TO LEARN MORE
        </Text>
      )}

      {items.map((item, index) => {
        if (isSleeveOpen && index !== selectedItemIndex) return null

        return (
          <Sleeve
            key={item.title}
            item={item}
            index={index}
            total={items.length}
            isSelected={index === selectedItemIndex}
            isOpen={index === selectedItemIndex && isSleeveOpen}
            onClick={() => {
              if (index === selectedItemIndex) {
                setIsSleeveOpen((prev) => !prev)
              } else {
                setIsSleeveOpen(false)
                setSelectedItemIndex(index)
              }
            }}
            entranceProgressRef={entranceProgressRef}
          />
        )
      })}

      {items[selectedItemIndex] && !isSleeveOpen && (
        <mesh position={[0.05, 0.1, -0.65]} raycast={() => null}>
          <planeGeometry args={[3.2, 2.2]} />
          <meshBasicMaterial
            color={items[selectedItemIndex].color}
            transparent
            opacity={0.05}
            depthWrite={false}
          />
        </mesh>

      
      )}
    </group>
  )
}