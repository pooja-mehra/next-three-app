
import {  useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function PreviewCylinder(props:any){
    const ref = useRef<any>()
    useFrame((state,delta) => {
    ref.current.rotation.x += 0.5 * delta;
    ref.current.rotation.y += 0.5 * delta;
    //state.camera.position.z = 50 + Math.sin(state.clock.getElapsedTime()) * 35
    })
    return (
        <mesh {...props} ref ={ref} position={props.position}>
        <cylinderGeometry args={[4,4,6]}/>
        <meshBasicMaterial color={0x00ff00} wireframe />
        </mesh>
    );
}