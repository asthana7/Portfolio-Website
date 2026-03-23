export default function TurntableBase() {
  return (
    <group>
      {/* shadow plane under player */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.42, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#1b1222" roughness={1} />
      </mesh>

      {/* main wood base */}
      <mesh receiveShadow castShadow position={[0, -0.18, 0]}>
        <boxGeometry args={[8.8, 0.6, 8.8]} />
        <meshStandardMaterial color="#7c4a32" roughness={0.9} />
      </mesh>

      {/* top surface accent */}
      <mesh receiveShadow position={[0, 0.13, 0]}>
        <boxGeometry args={[8.2, 0.05, 8.2]} />
        <meshStandardMaterial color="#8e5639" roughness={0.82} />
      </mesh>
    </group>
  )
}