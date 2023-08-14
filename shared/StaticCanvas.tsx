import Geometries from "./geometries"
import { useState, useRef} from 'react'
import { useFrame } from '@react-three/fiber'

export default function StaticCanvas(props:any){
    const geometry = Geometries('#ff6d6d')
    const [hovered,isHovered] = useState(false)
    const ref = useRef<any>()
    useFrame((_,delta) => {
    !hovered && (ref.current.rotation.x += 0.2 * delta,
    ref.current.rotation.y += 0.2 * delta)
    })
    const cloneElement = (e: any, args:any, color:string, id:number, name:string) => {
        props.cloneElement(e, args, color, id, name)
    }
    return (<mesh ref={ref}
      scale={[2, 2, 2]}
      rotation={[0, 0, 0]}
      position={[0, 0, 0]}
      onClick={(e: any) => {
        cloneElement(e,Object.values(geometry[props.i].type.parameters), geometry[props.i].color,geometry[props.i].id,geometry[props.i].name)
      }}
      onPointerOver={(e) =>{
        isHovered(true)
        }
      }
      onPointerOut={(e) =>{
        isHovered(false)
      }}
      geometry={geometry[props.i].type} >
      <meshStandardMaterial
        color={geometry[props.i].color}
        wireframe={hovered?false:true}
      />
    </mesh>)
}