
import { useState, useRef, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useThree, useFrame, MeshProps } from '@react-three/fiber'

export default function PreviewTorus(props:any){
    const ref = useRef<any>()
    useFrame((state,delta) => {
    ref.current.rotation.x += 0.2 * delta;
    ref.current.rotation.y += 0.2 * delta;
    state.camera.position.z = 50 + Math.sin(state.clock.getElapsedTime()) * 35
    state.camera.updateProjectionMatrix()

    })
    return (
        <mesh {...props} ref ={ref}>
        <torusGeometry args={[3, 1, 10]}/>
        <meshBasicMaterial color={0x00ff00} wireframe />
        </mesh>
    );
}