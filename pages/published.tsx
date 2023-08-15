import { useState, useRef, useLayoutEffect,useEffect, useMemo, Suspense , lazy} from 'react'
import { Canvas, useThree, useFrame, MeshProps, useLoader,extend } from '@react-three/fiber'
import { IndexedDB } from '@/services/indexeddb'
import * as THREE from 'three';
import {Vector3} from 'three'
import {Html,Text} from '@react-three/drei'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import Roboto from "../public/fonts/Roboto Black_Regular.json"

extend({ TextGeometry })
export default function Published(props:any) {
  const ref = useRef<any>()
  const [actions,setActions] = useState(new Array())
  const [properties,setproperties] = useState<any>({id:'',attr:{}})
  const [interact, isInteracting] = useState(false)
  const [updated, isUpdated] = useState(false)
  const font = new FontLoader().parse(Roboto);
  const [canvas,setCanvas] = useState<any>()
  const [reload, setReload] = useState(0);
  const geomRef = useRef<any>();
   const textOptions = {
      font,
      size: 0.5,
      height: 0.1,
      zIndex:1
   };
   async function getData(){
    setActions(await IndexedDB().getFromDB('actions'))
  }
  useEffect( ()=>{
    IndexedDB().createDB()
    getData()
    setReload(props.reload +1)
  },[props.reload])

  const setSequenceProperties = (item:any,action:string) =>{
    let keys = [...item[1].get(action).keys()];
            if(keys.includes('sequence')){
              let defaultAttrMap = new Map()
            let i = 1
            let interval = setInterval(()=>{
              defaultAttrMap.set(keys[i],item[1].get(action).get(keys[i]))
              setproperties({id:item[0],attr:defaultAttrMap})
              if(i == item[1].get(action).size-1){
                clearInterval(interval)
                isInteracting(true)
              }
              i++
            },1000)
            } else{
              setproperties({id:item[0],attr:item[1].get(action)})
            }
            isInteracting(true)
  }
   const PublishedMesh = (props:any) =>{
    const {item,geometry,element} = props 
    return( <mesh ref={geomRef}
        name={item[0]}
        rotation={interact && properties.id == item[0] && properties.attr.get('rotation')?properties.attr.get('rotation'):element.intersections.rotation}
        position={[element.intersections.position.x,element.intersections.position.y,element.intersections.position.z]}
        geometry={geometry} 
        onUpdate={()=>{
          if(item[1].has('default') && !interact && !updated) {
            if(properties.id != item[0] || (properties.id == item[0] && properties.attr.size <= item[1].get('default').size -1)){
              setSequenceProperties(item,'default')
              isUpdated(true)
            }
        }}}
        onPointerOver={()=>{
          if(item[1].has('hover')){
            setSequenceProperties(item,'hover')
        }}}
        onClick ={()=>{
          if(item[1].has('click')){
            setSequenceProperties(item,'click')
            }}}
        onPointerOut ={()=>{
          isInteracting(false)
        }}>
        <meshStandardMaterial
        color={interact && properties.id == item[0] && properties.attr.get('color')? properties.attr.get('color'):element.color}
        wireframe={interact && properties.id == item[0] && properties.attr.get('wireframe') ?properties.attr.get('wireframe'):element.wireframe}
        />
        
        {
          interact && properties.id == item[0] && properties.attr.get('text')?
          (<Text anchorX="center" anchorY="middle"
          color="black" position={[properties.attr.get('args') ? -properties.attr.get('args')[0] :-element.args[0],properties.attr.get('args') ? properties.attr.get('args')[0] :element.args[0],properties.attr.get('args') ? properties.attr.get('args')[0] :element.args[0]+1]} 
          fontSize={properties.attr.get('args') ? properties.attr.get('args')[0]/2 :element.args[0]/2}>{item[0] && properties.attr.get('text')} 
          </Text>):
           element.text && element.text != '' &&  <Text anchorX="center" anchorY="middle" fontSize={element.args[0]/2}
           position={[-element.args[0],element.args[0],element.args[0]+1]}>{element.text}</Text>
        }
        </mesh>)
    }

  return (
      <div>
        <Canvas ref ={ref} style={{backgroundColor:canvas?interact && properties.id == 'canvas' && properties.attr.get('color') ? properties.attr.get('color') :canvas.get('createElement').color:'white',height:props.height?props.height:'800px'}}
        camera={{ position: [0,0,6] }}
        onCreated={()=>{
          let newCanvas = actions.filter((item:any,index:number)=>item.has('canvas'))
          if(newCanvas && newCanvas.length > 0){
            setCanvas(newCanvas[0].get('canvas'))
          }
        }}
        onPointerOver={()=>{
          if(canvas && !interact){
            if(canvas.has('hover')){
              setproperties({id:'canvas',attr:canvas.get('hover')})
              isInteracting(true)
            }
          }
        }}
        onClick ={(e)=>{
          if(canvas && !interact){
            if(canvas.has('click')){
              setproperties({id:'canvas',attr:canvas.get('click')})
              isInteracting(true)
            }
          }
        }}
        onPointerOut ={()=>{
           isInteracting(false)
        }}>
        <directionalLight position={[3.3, 1.0, 4.4]}  />
        {actions && actions.length>0 && actions.map((action:any,index:number)=>{
            const items = action[Symbol.iterator]();
            for (const item of items) {
                if(item[1].has('createElement')){
                    let element = item[1].get('createElement')
                    if(element.name == 'text'){
                      return(<Html>
                        <div style={{marginLeft:element.left+'px', marginTop:element.top+'px', 
                        color:interact && properties.id == item[0] && properties.attr.get('color') ? properties.attr.get('color'):element.color,
                        fontFamily:interact && properties.id == item[0] && properties.attr.get('fontFamily') ? properties.attr.get('fontFamily'):element.fontFamily,
                        fontSize:interact && properties.id == item[0] && properties.attr.get('fontSize') ? properties.attr.get('fontSize'):element.fontSize}} 
                        onClick={(e)=>{
                          if(item[1].has('click')){
                            setproperties({id:item[0],attr:item[1].get('click')})
                            isInteracting(true)
                          
                          }
                        }}
                        onPointerOver={(e)=>{
                          if(item[1].has('hover')){
                            setproperties({id:item[0],attr:item[1].get('hover')})
                            isInteracting(true)
                          }
                        }}
                        onPointerOut = {(e)=>{isInteracting(false)}}
                        >{element.text}</div>
                      </Html>)
                    } 
                    else{
                    let geometry :any
                    let args = interact && properties.id == item[0] && properties.attr.get('args') ? properties.attr.get('args') :element.args
                    switch(element.name){
                        case'SphereGeometry':                          
                          geometry = new THREE.SphereGeometry(...args)
                          return (<PublishedMesh item={item} geometry={geometry} element={element} key={item[0]}/>)
                        case'CylinderGeometry':                            
                          geometry = new THREE.CylinderGeometry(...args)
                          return (<PublishedMesh item={item} geometry={geometry} element={element} key={item[0]}/>)
                  }
                }
              }
          }})}
        </Canvas>
      </div>
    )
}