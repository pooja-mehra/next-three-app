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

  useEffect(()=>{
    setReload(props.reload +1)
    IndexedDB().createDB()
    getData()
    let newCanvas = props.actions &&  props.actions.length > 0? props.actions.filter((item:any,index:number)=>item.has('canvas')):
    actions.filter((item:any,index:number)=>item.has('canvas'))
    if(newCanvas && newCanvas.length > 0){
      setCanvas(newCanvas[0].get('canvas'))
    }
    let newText = props.actions &&  props.actions.length > 0? props.actions.filter((item:any,index:number)=>!item.has('canvas')):
    actions.filter((item:any,index:number)=>!item.has('canvas'))
    if(newText && newText.length > 0){
    const items = newText[0][Symbol.iterator]();
    if(items){
    for (const item of items) {
      if(item[1].has('default')){
        if(!item[1].get('default').has('sequence') || (item[1].get('default').has('sequence') && item[1].get('default').get('sequence') == false)){
          for (const [key, value] of item[1].get('default')){
            if(item[1].get('createElement').hasOwnProperty(key)){
              item[1].get('createElement')[key] = item[1].get('default').get(key)
              //isHoverd(false)
            }
          }
        }
      }
    }
  }
}
  },[props.reload,props.actions])

  const setSequenceProperties = (item:any,action:string,index:number) =>{
    let keys = [...item[1].get(action).keys()];
    if(keys.includes('sequence') && item[1].get(action).get('sequence') == true //&& (action != 'default' || (action == 'default' && properties.id != item[0]))
    ){
        let defaultAttrMap = new Map()
        let i = 0
          let interval = setInterval(()=>{
            if(keys[i] != 'sequence'){
              defaultAttrMap.set(keys[i],item[1].get(action).get(keys[i]))
              setproperties({id:item[0],attr:defaultAttrMap})
              action != 'default' && isInteracting(true)
              if(action == 'default' && item[1].get('createElement').hasOwnProperty(keys[i])){
                item[1].get('createElement')[keys[i]] = item[1].get('default').get(keys[i])
              }
            }
            if(i == item[1].get(action).size){
              clearInterval(interval)
              isInteracting(true)
              isUpdated(true)
              setproperties({id:'',attr:{}})
            }
            i++
            },(index+1+i)*(i==0?200:600))
        
        } else{
          setproperties({id:item[0],attr:item[1].get(action)})
          if(action == 'default'){
            for(let i in keys){
              if(item[1].get('createElement').hasOwnProperty(keys[i])){
                item[1].get('createElement')[keys[i]] = item[1].get('default').get(keys[i])
              }
            }
          }
          isInteracting(true)
          isUpdated(true)
        }
  }
  
  const[hoverd,isHoverd] = useState(false)
   const PublishedMesh = (props:any) =>{
    const {item,geometry,element,index} = props 
    return( <mesh ref={geomRef}
        name={item[0]}
        rotation={properties.id == item[0] && properties.attr.has('rotation')? properties.attr.get('rotation'): element.intersections.rotation}
        position={[element.intersections.position.x,element.intersections.position.y,element.intersections.position.z]}
        geometry={geometry} 
        onUpdate={()=>{
          if(item[1].has('default') && !updated ) {
            if(properties.id != item[0] ||(properties.id == item[0] && properties.attr.size <= item[1].get('default').size -1 )){
              setSequenceProperties(item,'default',index)
            }
          }
          //isHoverd(false)
      }}
        onPointerOver={(e)=>{
          if(item[1].has('hover')){
            isHoverd(true)
            setSequenceProperties(item,'hover',index)
          }}}
          
        onClick ={()=>{
          if(item[1].has('click')){
            setSequenceProperties(item,'click',index)
        }}}
       onPointerMove ={(e)=>{
        if(item[1].has('hover')){
          //isHoverd(true)
          }}}>
        <meshStandardMaterial
        color={properties.id == item[0] && properties.attr.has('color')? properties.attr.get('color'):element.color}
        wireframe={properties.id == item[0] && properties.attr.has('wireframe')?properties.attr.get('wireframe'):element.wireframe}
        />
        {
           properties.id == item[0] && properties.attr.get('text')?
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
      <div style={{height:props.height?'20vh':'100vh'}}>
        <Canvas ref ={ref} style={{backgroundColor:canvas?interact && properties.id == 'canvas' && properties.attr.has('color') ? properties.attr.get('color') :canvas.get('createElement').color:'white'}}
        camera={{ position: [0,0,6] }}
        
        onCreated ={()=>{
          let newCanvas =  actions.filter((item:any,index:number)=>item.has('canvas'))
          if(newCanvas && newCanvas.length > 0){
            setCanvas(newCanvas[0].get('canvas'))
          }}}
        onPointerMove={(e)=>{
          if(properties.id != 'canvas' && hoverd == true && (Math.abs(e.movementX) != 0 || Math.abs(e.movementY) != 0)){
            setproperties({id:'',attr:{}})
          }}}
        onPointerOver={(e)=>{
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
           isHoverd(false)
        }}>
        <directionalLight position={[3.3, 1.0, 4.4]}  />
        {actions && actions.length>0 && actions.map((action:any,index:number)=>{
            const items = action[Symbol.iterator]();
            for (const item of items) {
                if(item[1].has('createElement')){
                    let element = item[1].get('createElement')
                    if(element.name == 'text'){
                      if(item[1].has('default') && !updated){
                        setSequenceProperties(item,'default',index)
                      }
                      return(<Html>
                        <div style={{marginLeft:properties.id == item[0] && properties.attr.has('left')? properties.attr.get('left')+'px':element.left+'px', marginTop:properties.id == item[0] && properties.attr.has('top')? props.height?properties.attr.get('top')[0]/4+'px':properties.attr.get('top')[0]+'px':props.height?element.top/4+'px':element.top+'px', 
                        color: properties.id == item[0] && properties.attr.has('color')?  properties.attr.get('color'): element.color ,
                        fontFamily:properties.id == item[0] && properties.attr.has('fontFamily') ? properties.attr.get('fontFamily'):element.fontFamily,
                        fontSize: properties.id == item[0] && properties.attr.has('fontSize') ? properties.attr.get('fontSize'):element.fontSize,
                        }} 
                        onClick={(e)=>{
                          if(item[1].has('click')){
                            setSequenceProperties(item,'click',index)
                            //setproperties({id:item[0],attr:item[1].get('click')})
                            //isInteracting(true)
                          }
                        }}
                        onPointerOver={(e)=>{
                          if(item[1].has('hover')){
                            setSequenceProperties(item,'hover',index)
                            //setproperties({id:item[0],attr:item[1].get('hover')})
                            //isInteracting(true)
                          }
                        }}
                        onPointerOut = {()=>{isInteracting(false)}}
                        >{element.text}</div>
                      </Html>)
                    } 
                    else{
                    let geometry :any
                    let args = properties.id == item[0]  && properties.attr.has('args') ? properties.attr.get('args') :element.args
                    switch(element.name){
                        case'SphereGeometry':                          
                          geometry = new THREE.SphereGeometry(...args)
                          return (<PublishedMesh item={item} geometry={geometry} element={element} index={index} key={item[0]}/>)
                        case'CylinderGeometry':                            
                          geometry = new THREE.CylinderGeometry(...args)
                          return (<PublishedMesh item={item} geometry={geometry} element={element} index={index} key={item[0]}/>)
                        case'BoxGeometry':                            
                          geometry = new THREE.BoxGeometry(...args)
                          return (<PublishedMesh item={item} geometry={geometry} element={element}  index={index} key={item[0]}/>)
                        case'ConeGeometry':                            
                          geometry = new THREE.ConeGeometry(...args)
                          return (<PublishedMesh item={item} geometry={geometry} element={element} index={index} key={item[0]}/>)
                        case'TorusGeometry':                            
                          geometry = new THREE.TorusGeometry(...args)
                          return (<PublishedMesh item={item} geometry={geometry} element={element} index={index} key={item[0]}/>)
                  }
                }
              }
          }})}
        </Canvas>
      </div>
    )
}