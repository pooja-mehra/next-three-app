
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function PreviewCone(props:any){
    const ref = useRef<any>()
    useFrame((state,delta) => {
    ref.current.rotation.x += 0.2 * delta;
    ref.current.rotation.y += 0.2 * delta;
    //state.camera.position.z = 50 + Math.sin(state.clock.getElapsedTime()) * 35
    })
    return (
        <mesh {...props} ref ={ref} position ={props.position}>
        <coneGeometry args={[1, 2, 20]}/>
        <meshBasicMaterial color={0x00ff00} wireframe />
        </mesh>
    );
}