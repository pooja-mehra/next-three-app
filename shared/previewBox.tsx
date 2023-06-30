
import { useState, useRef, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useThree, useFrame, MeshProps } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { Color, Vector3 } from 'three'

export default function PreviewBox(props:any){
  const ref = useRef<any>() 
  const black = useMemo(() => new Color('black'), [])
  const lime = useMemo(() => new Color('teal'), [])
  const [hovered, setHovered] = useState(false)
    useFrame(({mouse,viewport}) => {
    const x = (mouse.x * viewport.width) * 2.5
    const y = (mouse.y * viewport.height) *2.5
    !hovered && props.isMultiList || props.isText ? ref.current.lookAt(0,0,0):ref.current.lookAt(x, y, 1) 
    ref.current.material.color.lerp(hovered &&  !props.isText? lime : black, 0.05)
    })
    return (
        <mesh {...props} ref ={ref}
        onPointerOver={() => setHovered(true)}
        onPointerOut={(e) => {setHovered(false)}}
        >
        <boxGeometry />
        <meshBasicMaterial color={lime} />
        <Text fontSize={props.font} position-z={0.501} >
        {props.text}
        </Text>
        </mesh>
    );
}