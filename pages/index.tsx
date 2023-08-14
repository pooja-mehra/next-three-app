import { useState, useRef, useEffect, useMemo , lazy} from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import MultiList from '../shared/multilist'
import PreviewSphere from '@/shared/previewSphere';
import { Vector3, Quaternion } from 'three'
import Curve from '@/shared/curve';
const ModelComponent = lazy(() => import("@/shared/model"));

export default function Launch() {
  const [height, setHeight] = useState(0);
  const [geo,setGeo] = useState('sphere')
  const [count,setCount] = useState(0)
  const types = ['sphere','box','cone']
  
  function Ball(props:any) {
    const dropGeo = (type:string) =>{
      switch(type){
        case 'sphere':
        return (
          <>
          <mesh ref={ref} position={[0,0,0]}>
          <sphereGeometry args={[1,8,8]} />
          <meshNormalMaterial wireframe />
        </mesh>
       </>
        );
        case 'box':
          return(
            <mesh ref={ref} position={[4,0,0]}>
            <boxGeometry args={[1,1,1,50]} />
            <meshNormalMaterial wireframe />
          </mesh>
          );
        case 'cone':
          return(
          <mesh {...props} ref ={ref} position={[-4,0,0]}>
            <coneGeometry args={[0.5, 1, 50]}/>
            <meshNormalMaterial wireframe />
            </mesh>)
        default:
          return
      }
    }
    const ref = useRef<any>()
    const v = useMemo(() => new Vector3(), [])
    const q = useMemo(() => new Quaternion(), [])
    const angularVelocity = useMemo(() => new Vector3(), [])
  
    useFrame((state, delta) => {
      angularVelocity.x -= delta 
      angularVelocity.z -= delta 
      ref.current.position.z += angularVelocity.z
      q.setFromAxisAngle(angularVelocity, delta).normalize()
      ref.current.applyQuaternion(q)
      angularVelocity.lerp(v, 0.01) // slow down the roll
    })
    return (
      dropGeo(props.type)
    )
  }
  
  useEffect(()=>{
    if (window && typeof window !== 'undefined') {
       setHeight(window.innerHeight)
    }
  },[])
  const ref = useRef<any>()
  const testArray = [1,2,3]
  /*setInterval(()=>{
    setGeo(types[count])
    count >=2 ? setCount(0): setCount(count+1)
  },4000)*/
  function Rig() {
    const { camera, mouse } = useThree()
    const vec = new Vector3()
  
    return useFrame((state,delta) => {
      camera.position.lerp(vec.set(mouse.x, mouse.y, camera.position.z), 0.05)
      camera.lookAt(0, 0, 0)
    })
  }

  const [hovered,setHover] = useState(false)
  const hoverAnimation =(e:any) =>{
    setHover(e)
  }
  return (
      <div>
        <Canvas style={{backgroundColor:'white', height:height/3}}
        camera={{ position: [0,0,6] }} >
        <directionalLight position={[3.3, 1.0, 4.4]}  />
        <PreviewSphere position={[-4, 2 , 0]} color={'white'} scale={[4,3,1]} hovered={hovered}
          text={<PreviewSphere position={[0, 0, 0]} color={'black'} scale={[0.5,0.5,0.5]} />} font={0.1} />
          <PreviewSphere position={[4, 2 , 0]} color={'white'} scale={[4,3,1]}  hovered={hovered}
          text={<PreviewSphere position={[0, 0, 0]} color={'black'} scale={[0.5,0.5,0.5]} />} font={0.1} />
          {
            hovered &&
            <><Curve r={5} y={1.3}/>
            <Curve r={4.5} y={0.3}/></>
          }
      <Rig />
      </Canvas>
      <MultiList height={height/3} hoverAnimation ={(e:any)=>hoverAnimation(e)}/>
      </div>
    )
}