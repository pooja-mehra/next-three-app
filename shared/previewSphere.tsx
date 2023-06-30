
import { useState, useRef, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useThree, useFrame, MeshProps } from '@react-three/fiber'

export default function PreviewSphere(props:any){
    const ref = useRef<any>()
    useFrame((state,delta) => {
    ref.current.rotation.x += 0.2 * delta;
    ref.current.rotation.y += 0.2 * delta;
    //state.camera.position.z = 50 + Math.sin(state.clock.getElapsedTime()) * 35
    })
    return (
        <mesh {...props} ref ={ref}  position={props.position}
        onPointerOver={(e)=>console.log(ref.current.geometry.uuid)}>
        <sphereGeometry args={[0.5,16,16]}/>
        <meshBasicMaterial color={0x00ff00} wireframe />
        </mesh>
    );
}