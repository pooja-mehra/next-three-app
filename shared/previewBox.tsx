
import { useState, useRef, useMemo } from 'react'
import {  useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { Color, Vector3 } from 'three'
import * as THREE from 'three';

export default function PreviewBox(props:any){
  const texture = new THREE.TextureLoader().load('images/grid.png' );
  //const texture = useLoader(THREE.TextureLoader,[...url])
  const ref = useRef<any>() 
  const black = useMemo(() => new Color('black'), [])
  const lime = useMemo(() => new Color('lime'), [])
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
       // material={new THREE.MeshBasicMaterial({ map: texture })}
        >
        <boxGeometry />
        <Text fontSize={props.font} position-z={0.6} >
        {props.text}
        </Text>
        </mesh>
    );
}