import React from 'react'
import { useGLTF } from '@react-three/drei'
import { Stats, OrbitControls, Circle } from '@react-three/drei'

export default function Model() {
  const model = useGLTF("models/monkey.glb")
  return (
    <>
    <primitive
    object={model.scene}
    position={[4, 1, 0]}
    children-0-castShadow
  />
    <primitive
    object={model.scene}
    position={[-4, 1, 0]}
    children-0-castShadow
    />
   
</>
  )
}