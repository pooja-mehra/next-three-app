
import { useState, useRef, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useThree, useFrame, MeshProps } from '@react-three/fiber'
import { Text } from '@react-three/drei'

export default function PreviewSphere(props:any){
    const ref = useRef<any>()
    const [hovered, setHovered] = useState(false)
    useFrame(({mouse,viewport}) => {
        const x = (mouse.x * viewport.width) * 2.5
        const y = (mouse.y * viewport.height) * 2.5
        !hovered && props.isMultiList ? ref.current.lookAt(0,0,0):ref.current.lookAt(x, y, 1) 
        })
    return (
        <mesh {...props} ref ={ref}  position={props.position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={(e) => {setHovered(false)}}>
        <sphereGeometry args={[0.5,16,8]}/>
        <Text fontSize={props.font} position-z={0.6} >
        {props.text}
        </Text>
        <meshBasicMaterial color={props.color}  />
        </mesh>
    );
}