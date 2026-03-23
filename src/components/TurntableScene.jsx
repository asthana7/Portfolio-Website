import { Canvas } from "@react-three/fiber"
import { Float, OrbitControls } from "@react-three/drei"
import Record from "./Record"
import NeedleArm from "./NeedleArm"
import TurntableBase from "./TurntableBase"
import CosmicBackground from "./CosmicBackground"
import WaveformRibbon from "./WaveformRibbon"
import ContentSleeves from "./ContentSleeves"
import RecordCrateNav from "./RecordCrateNav"
import { Environment } from "@react-three/drei"
import CameraRig from "./CameraRig"
import { useEffect, useState } from "react"

export default function TurntableScene({
  activeIndex,
  activeSection,
  selectedItemIndex,
  setSelectedItemIndex,
  setActiveIndex,
  isSleeveOpen,
  setIsSleeveOpen
}) {

  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setReady(true), 400)
    return () => clearTimeout(id)
  }, [])
  return (
    <Canvas
      shadows
      camera={{ position: [-1.2, 3.4, 8.6], fov: 34 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <color attach="background" args={["#090611"]} />
      <fog attach="fog" args={["#090611", 18, 34]} />

      <ambientLight intensity={0.95} />

      <directionalLight
        position={[4, 7, 6]}
        intensity={2.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <pointLight position={[-4, 4, 4]} intensity={1.15} color="#ffd6a5" />
      <pointLight position={[4, 5, 2]} intensity={1.1} color="#b88cff" />
      <pointLight position={[0, 2.5, -4]} intensity={0.85} color="#7cc8ff" />

      <directionalLight
        position = {[-4, 3, 4]}
        intensity = {0.9}
        color = "#c9d8ff"
        />

      <spotLight
        position={[3, 4, 2]}
        angle = {0.5}
        penumbra={0.6}
        intensity = {1.2}
        castShadow
      />
      <Environment preset="studio" intensity={0.18} />

      <CameraRig activeIndex={activeIndex} />
      <CosmicBackground />

      <Float speed={1.1} rotationIntensity={0.02} floatIntensity={0.05}>
        <group position={[1.4, -0.55, 0.1]} scale={1.18}>
          <TurntableBase />
          <Record activeSection={activeSection} activeIndex={activeIndex} />
          <NeedleArm activeIndex={activeIndex} />
        </group>
      </Float>

      <WaveformRibbon activeIndex={activeIndex} activeSection={activeSection} />
      
      {Boolean(activeSection.items?.length) && (
        <ContentSleeves
          key={activeSection.id}
          items={activeSection.items}
          visible={true}
          selectedItemIndex={selectedItemIndex}
          setSelectedItemIndex={setSelectedItemIndex}
          isSleeveOpen={isSleeveOpen}
          setIsSleeveOpen={setIsSleeveOpen}
        />
      )}

       <Float speed={1.1} rotationIntensity={0.02} floatIntensity={0.05}></Float>

      <group scale={0.92}>
        <RecordCrateNav
          sections={[
            { id: "about", title: "About" },
            { id: "experience", title: "Experience" },
            { id: "projects", title: "Projects" },
            { id: "contact", title: "Contact" }
          ]}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setSelectedItemIndex={setSelectedItemIndex}
        />
      </group>
    </Canvas>
  )
}