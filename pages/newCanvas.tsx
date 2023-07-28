import { useState, useRef, useEffect, useMemo, Suspense, useLayoutEffect, useCallback, ReactElement } from 'react'
import { animated } from '@react-spring/three'
import { Canvas, useThree, useFrame, MeshProps} from '@react-three/fiber'
import {
  Text,
  MeshTransmissionMaterial,
  MeshDistortMaterial,
  Html,
  Stats,
  OrbitControls
} from '@react-three/drei'
import Box from '@mui/material/Box'
import { IconButton, Typography } from '@mui/material'
import Stack from '@mui/material/Stack'
import {
  BoxGeometry,
  BufferGeometry,
  Mesh,
  DoubleSide,
  Vector3,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  MeshStandardMaterial,
  AmbientLight,
  DirectionalLight,
  PointLight,
  BackSide,
} from 'three'
import { useDrag } from 'react-use-gesture'
import { Physics } from '@react-three/cannon'
import { faEllipsisV, height } from '@fortawesome/free-solid-svg-icons/faEllipsisV'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NavigationIcon from '@mui/icons-material/Navigation'
import Fab from '@mui/material/Fab'
import { text } from 'stream/consumers'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import List from '@mui/material/List';
import ListItem from '@mui/material'
import MenuList from '@mui/material/MenuList';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import TextMesh from '../shared/previewText'
import PreviewCone from '@/shared/previewCone'
import PreviewBox from '@/shared/previewBox'
import Draggable from "react-draggable";
import ClearIcon from '@mui/icons-material/Clear';
import * as THREE from 'three';
import ColorPallet from '@/shared/colorpallet';
import TextBox from '@/shared/textbox';
import Font from '@/shared/font'
import Geometries from '@/shared/geometries'
import CommonMenu from '@/shared/commonMenu'
import LeftPane from '@/shared/leftpane'
import DetailsIcon from '@mui/icons-material/Details';
import { Transform } from 'stream'
import { setInterval } from 'timers'
import Preview from '@/shared/preview'
import { ScreenCapture } from 'react-screen-capture';
import Image from 'next/image'
const AnimatedMeshDistortMaterial:any = animated(MeshDistortMaterial)

export default function NewCanvas(props:any) {
  const editContent = useRef<any>(null);
  const divRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  const [editableDiv, isEditableDiv] = useState(false)
  const [textArray, setTextArray] = useState(new Array())
  //const [elements, addElement] = useState(new Array())
  const [clicked, isClicked] = useState(false)
  const [dragging, isdragging] = useState(false)
  const [join, showJoin] = useState(false)
  const [pointerPosition, setPointerPosition] = useState([0, 0, 0])
  const [lastPosition, setLastPosition] = useState([-10, -10])
  const [newIntersections, setNewIntersections] = useState(new Map())
  const [draggedElement, setDraggedElement] = useState('element')
  const [intersectingIndex, setIntersectingIndex] = useState([-1])
  const [open, setOpen] = useState(true);
  const elements = useMemo(() => new Array(),[])
  const [newcolor,setNewColor] = useState('#ff6d6d')
  const [font, setFontStyle] = useState({style:'serif', size:'15px'})
  const [selected,setSelected] = useState<any>()
  const [wireframe,isWireFrame] = useState(false)
  const [autoRotate,isAutoRotate] = useState(false)
  const canvas = useMemo(()=> [{color:'white'}],[])
  const gl = THREE.WebGLRenderer
  /*const color = useControls({
    value: 'lightblue',
  })*/
  const [canvasURL,setCanvasURL] = useState('')
  const setEditableDiv = () =>{
    isEditableDiv(true)
  }

  const setColor = (color:string, index:number, element:any, name:string) =>{
    setNewColor(color)
    switch(name){
      case 'text':
        return  (setTextArray(textArray.map((t,i)=>{
          if(i == index){
            return {...t, color:color}
          } else{
            return t
          }
        })))
      case 'element':
        return element[index].color = color
      default:
        return canvas[0].color = color
    }
  }

  const setFont = (fontFamily:string, index:number, elements:any) =>{
    setFontStyle({...font,style:fontFamily})
    textArray[index].fontFamily = fontFamily
  }

  const setFontSize = (size:string, index:number, elements:any) =>{
    setFontStyle({...font,size:size})
    textArray[index].fontSize = size
  }

  const setWireFrame = (element:any,index:number) =>{
    isWireFrame(!element[index].wireframe)
    element[index].wireframe = !element[index].wireframe

  }

  const [interval,addInterval] = useState()

  const setAutoRotate = (element:any,index:number) =>{
    isAutoRotate(!element[index].autoRotate)
    element[index].autoRotate = !element[index].autoRotate
    //if(!autoRotate){
    const interval = setInterval(() => {
        console.log('inside interval');
    }, 500);
    setTimeout(() =>{
      console.log('stop interval');
      clearInterval(interval), 5000})
    }

  const rotate = (element:any,index:number) =>{
    setRotation({
      x: element[index].intersections.rotation[0] += 0.5,
      y: element[index].intersections.rotation[1] += 0.5,
      z: element[index].intersections.rotation[1] += 0.5,
      isRotate:true,
      isRotateZ: false,
      index: index
    })
  }

  const setElementSize = (size:number, name:number, element:any,index:number) =>{
    if([0,1,2].includes(name)){
      let args = []
      element[index].args[name] = size
      name == 0? args.push(size,element[index].args[1],element[index].args[2]): name == 1 ? args.push(element[index].args[0],size,element[index].args[2]) : args.push(element[index].args[0],element[index].args[1],size)
      setSize({args:args, index:index, isResize: true, sizeTool:'slider' })
    } else{
      let rotaionArgs = []
      element[index].intersections.rotation[name] = size
      name == 3? rotaionArgs.push(size,element[index].intersections.rotation[1],element[index].intersections.rotation[2]): 
      name == 4 ? rotaionArgs.push(element[index].intersections.rotation[0],size,element[index].intersections.rotation[2]) : 
      rotaionArgs.push(element[index].intersections.rotation[0],element[index].intersections.rotation[1],size)
      setRotation({
        x: rotaionArgs[0],
        y: rotaionArgs[1],
        z: rotaionArgs[2],
        isRotate:true,
        isRotateZ: false,
        index: index
      })
    }
    
  }

  const geometry = Geometries('#ff6d6d')
  //const geometry = useMemo(() => geometries,[geometries])

  const StaticMesh = (props:any) =>{
    const ref = useRef<any>()
    useFrame((_,delta) => {
    ref.current.rotation.x += 0.2 * delta
    ref.current.rotation.y += 0.2 * delta
    })
    return (<mesh ref={ref}
      scale={[2, 2, 2]}
      rotation={[0, 0, 0]}
      position={[0, 0, 0]}
      geometry={geometry[props.i].type} >
      <meshStandardMaterial
        color={geometry[props.i].color}
        wireframe={true}
      />
    </mesh>)
  }
  
  const MainMesh = (props:any) =>{
    const {e,i} = props
    const ref = useRef<any>()
    useFrame((_, delta) => {
      if (autoRotate) {
        ref.current.rotation.x += 1 * delta
        ref.current.rotation.y += 1 * delta
      }
    })
    
  }
 
  const handleClick = () => {
    setOpen(!open);
  };

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number
    mouseY: number
    index: number
    contextEvent: any
  } | null>(null)
  const [textMenu, setTextMenu] = useState<{
    mouseX: number
    mouseY: number
    contextEvent: any
  } | null>(null)
  
  const [rotation, setRotation] = useState({
    x: 0.5,
    y: 0.5,
    z: 0,
    isRotate: false,
    isRotateZ: false,
    index: -1
  })
  const [resize, setSize] = useState({
    args: [0, 0, 0],
    index: -1,
    isResize: false,
    sizeTool:'cursor'
  })
  const handleContextMenu = (event: any, i : number) => {
    setTextMenu(null)
    setContextMenu(
      {
        mouseX: event.clientX + 2,
        mouseY: event.clientY - 6,
        index: i,
        contextEvent: event
      }
    )
  }
  const handleTextMenu = (event: any) => {
    setTextMenu(
      {
        mouseX: event.clientX + 2,
        mouseY: event.clientY - 6,
        contextEvent: event
      }
    )
  }
  const handleClose = () => {
    setContextMenu(null)
    setTextMenu(null)
  }

  const intersectingElements = (
    event: any,
    index: number | undefined,
    i: number
  ) => {
    let x = event.point.x
    let y = event.point.y
    if (elements && elements.length >= 2) {
      elements.filter((ele, index) => {
        if (ele.name + ele.id == event.eventObject.name) {
          intersectingIndex.push(index)
        }
        if (
          event.eventObject.userData.isintersect == true &&
          ele.name + ele.id != event.eventObject.name &&
          ele.intersections.isintersect == true &&
          ele.intersections.intersectionName ==
            event.eventObject.userData.intersectionName
        ) {
          let diffY = Math.abs(y - ele.intersections.position.x)
          let diffX = Math.abs(x - ele.intersections.position.x)
          ele.intersections.position.y =
            y > ele.intersections.position.y
              ? event.point.y + diffY
              : event.point.y - diffY
          ele.intersections.position.x =
            x > ele.intersections.position.x
              ? event.point.x + diffX
              : event.point.x - diffX
        }
      })
    }
    mergeElements(event)
  }
  const rgbToHex = (r:number, g:number, b:number) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')

  const cloneElement = (args:any, color:string, id:number, name:string) => {
    isClicked(!clicked)
    elements.push({
      name: name,
      args: args,
      color:color,
      id: id,
      wireframe:false,
      autoRotate:false,
      intersections: {
        isintersect: false,
        intersectionName: '',
        name: name,
        args: args,
        boundaries: { top: 0, bottom: 0, right: 0, left: 0 },
        position: new Vector3(0, 3, 0),
        rotation: [0.5, 0.5, 0]
      }
    })
    /*e.eventObject.userData = {
      isintersect: false,
      intersectionName: '',
      name: name,
      args: args,
      boundaries: { top: 0, bottom: 0, right: 0, left: 0 },
      position: new Vector3(0, 3, 0),
      rotation: [0.5, 0.5, 0],
      color:color
    }*/
  }

  const detachElement = (
    e: any,
    index: undefined | number,
    contextEvent: any
  ) => {
    if (contextEvent.intersections.length > 0) {
      if (contextEvent.intersections.length > 1) {
        contextEvent.intersections.forEach((element: any) => {
          if (element.eventObject.userData.isintersect == true) {
            elements.filter((ele: any) => {
              if (ele.name + ele.id == element.eventObject.name) {
                const intersectingNames = newIntersections.get(
                  ele.intersections.intersectionName
                )
                newIntersections
                  .get(ele.intersections.intersectionName)
                  .splice(intersectingNames.indexOf(ele.name + ele.id), 1)
                ele.intersections.isintersect = false
                ele.intersections.intersectionName = ''
              }
            })
            element.eventObject.userData.isintersect = false
            element.eventObject.userData.intersectionName = ''
          }
        })
      } else {
        if (index != undefined) {
          //contextEvent.intersections[0].userData.isintersect = false
          //contextEvent.intersections[0].userData.intersectionName = ''
          const intersectingNames = newIntersections.get(
            elements[index].intersections.intersectionName
          )
          newIntersections
            .get(elements[index].intersections.intersectionName)
            .splice(
              intersectingNames.indexOf(
                elements[index].name + elements[index].id
              ),
              1
            )
          elements[index].intersections.isintersect = false
          elements[index].intersections.intersectionName = ''
        }
      }
    }
    handleClose()
  }
  const [anchorEl, setAnchorEl] = useState(null);
  const anchorClose = () => {
    setAnchorEl(null);
    isAnchor(false)
  };
  const [anchor,isAnchor] = useState(false)
  
  const mergeElements = (e: any) => {
    intersectingIndex.shift()
    if (intersectingIndex.length > 1) {
      let intersects = elements.filter(
        (e) =>
          intersectingIndex.includes(elements.indexOf(e)) &&
          e.intersections.isintersect == true
      )
      if (intersects && intersects.length > 0) {
        if (intersects.length > 1) {
          let otherIntersects = intersects.filter(
            (i) =>
              intersects.indexOf(i) != 0 &&
              i.intersections.intersectionName !=
                intersects[0].intersections.intersectionName
          )
          if (otherIntersects && otherIntersects.length > 0) {
            otherIntersects.forEach((o) => {
              let intersectionName = o.intersections.intersectionName
              let otherIntersectsName = newIntersections.get(
                o.intersections.intersectionName
              )
              otherIntersectsName.forEach((name: string) => {
                elements.filter((e) => {
                  if (e.name + e.id == name) {
                    e.intersections.intersectionName =
                      intersects[0].intersections.intersectionName
                    newIntersections
                      .get(intersects[0].intersections.intersectionName)
                      .push(name)
                  }
                })
              })
              intersectionName !=
                intersects[0].intersections.intersectionName &&
                newIntersections.delete(intersectionName)
            })
          }
        }
        elements.filter((e, index) => {
          if (
            intersectingIndex.includes(index) &&
            e.intersections.isintersect == false
          ) {
            e.intersections.isintersect = true
            e.intersections.intersectionName =
              intersects[0].intersections.intersectionName
            newIntersections
              .get(intersects[0].intersections.intersectionName)
              .push(e.name + e.id)
          }
        })
      } else {
        let intersectKey = newIntersections.size
        newIntersections.set('Intersection' + intersectKey, [])
        elements.filter((e, index) => {
          if (
            intersectingIndex.includes(index) &&
            e.intersections.isintersect == false
          ) {
            newIntersections
              .get('Intersection' + intersectKey)
              .push(e.name + e.id)
            e.intersections.isintersect = true
            e.intersections.intersectionName = 'Intersection' + intersectKey
          }
        })
        if (newIntersections.get('Intersection' + intersectKey).length <= 1) {
          newIntersections.delete('Intersection' + intersectKey)
        }
      }
    }
    setIntersectingIndex([-1])
    showJoin(false)
    isdragging(false)
  }

  const findIndex = (event: any, elementIndex: number) => {
    let x = event.x
    let y = event.y
    event.intersections.filter((i: any, index: any) => {
      if (i.eventObject.name == draggedElement) {
        x = event.intersections[index].eventObject.position.x
        y = event.intersections[index].eventObject.position.y
        event.intersections[index].eventObject.position.x = event.point.x
        event.intersections[index].eventObject.position.y = event.point.y
        if (elements[elementIndex].intersections.isintersect == true) {
          let intersectingNames = newIntersections.get(
            elements[elementIndex].intersections.intersectionName
          )
          if (intersectingNames && intersectingNames.length > 0) {
            let intesectingElements = elements.filter(
              (e) =>
                e.intersections.isintersect == true &&
                intersectingNames.includes(e.name + e.id) &&
                e.name + e.id != draggedElement
            )
            if (intesectingElements && intesectingElements.length > 0) {
              intesectingElements.forEach((e,i) => {
                event.eventObject.parent.children.filter(
                  (c: any, index: number) => {
                    if (c.name == e.name + e.id) {
                      let diffY = Math.abs(y - c.position.y)
                      let diffX = Math.abs(x - c.position.x)
                      c.position.y =
                        event.movementY >= 0 && y - c.position.y >=0
                          ? event.point.y + diffY
                          : event.point.y - diffY
                      c.position.x =
                        event.movementX >= 0 && x - c.position.x >=0 
                          ? event.point.x + diffX
                          : event.point.x - diffX
                       
                    }
                  }
                )
              })
            } else {
              elements[elementIndex].intersections.intersectionName = ''
              elements[elementIndex].intersections.isintersect = false
            }
          }
        }
      }
    })
  }

  const getBoundaries = (event: any, index: number, isNew: boolean) => {
    switch (elements[index].name) {
      case 'BoxGeometry':
        return {
          top:
            event.eventObject.position.y + event.eventObject.userData.args[1],
          bottom:
            event.eventObject.position.y - event.eventObject.userData.args[1],
          left:
            event.eventObject.position.x - event.eventObject.userData.args[0],
          right:
            event.eventObject.position.x + event.eventObject.userData.args[0]
        }
      case 'SphereGeometry':
        return {
          top:
            event.eventObject.position.y + event.eventObject.userData.args[0],
          bottom:
            event.eventObject.position.y - event.eventObject.userData.args[0],
          left:
            event.eventObject.position.x - event.eventObject.userData.args[0],
          right:
            event.eventObject.position.x + event.eventObject.userData.args[0]
        }
      case 'CylinderGeometry':
        return {
          top:
            event.eventObject.position.y + event.eventObject.userData.args[2],
          bottom:
            event.eventObject.position.y - event.eventObject.userData.args[2],
          left:
            event.eventObject.position.x - event.eventObject.userData.args[0],
          right:
            event.eventObject.position.x + event.eventObject.userData.args[0]
        }
      default:
        return { top: 0, bottom: 0, right: 0, left: 0 }
    }
  }

  const setElementRotation = (event: any, index: undefined | number) => {
    if (event.movementX > 0) {
      rotation.y = rotation.y + 0.1
      rotation.z = rotation.z + 0.1
    }
    if (event.movementX < 0) {
      rotation.y = rotation.y - 0.1
      rotation.z = rotation.z - 0.1
    }
    if (event.movementY > 0) {
      rotation.x = rotation.x - 0.1
      rotation.z = rotation.z - 0.1
    }
    if (event.movementY < 0) {
      rotation.x = rotation.x + 0.1
      rotation.z = rotation.z + 0.1
    }
    rotation.isRotateZ
      ? setRotation({
          x: rotation.x,
          y: rotation.y,
          z: rotation.z,
          isRotate: false,
          isRotateZ: true,
          index: index ? index : 0
        })
      : setRotation({
          x: rotation.x,
          y: rotation.y,
          z: rotation.z,
          isRotate: true,
          isRotateZ: false,
          index: index ? index : 0
        })
  }

  const showBoundaries = (elements: any, index: number) => {
    let indexes: number[] = []
    let elementsName = newIntersections.get(
      elements[index].intersections.intersectionName
    )
    if (elementsName && elementsName.length > 0) {
      elements.filter((e: any, i: number) => {
        if (elementsName.includes(e.name + e.id)) {
          indexes.push(i)
        }
      })
    } else {
      elements[index].intersections.intersectionName = ''
      elements[index].intersections.isintersect = false
    }
  }

  const setElemetArgs = (event: any, index: number) => {
    let incrementX =
      event.movementX > 0
        ? 'positive'
        : event.movementX < 0
        ? 'negative'
        : 'zero'
    let incrementY =
      event.movementY > 0
        ? 'positive'
        : event.movementY < 0
        ? 'negative'
        : 'zero'
    switch (elements[index].name) {
      case 'BoxGeometry':
        let boxArgs = [
          incrementX == 'positive'
            ? resize.args[0] + 0.1
            : incrementX == 'negative'
            ? resize.args[0] - 0.1
            : resize.args[0],
          incrementY == 'positive'
            ? resize.args[1] + 0.1
            : incrementY == 'negative'
            ? resize.args[1] - 0.1
            : resize.args[1],
          resize.args[2]
        ]
        setSize({args: boxArgs, index: index, isResize: true, sizeTool:'cursor' })
        return
      case 'CylinderGeometry':
        let cylinderArgs = [
          incrementX == 'positive'
            ? resize.args[0] + 0.1
            : incrementX == 'negative' && resize.args[0] > 0.2
            ? resize.args[0] - 0.1
            : resize.args[0],
          incrementX == 'positive'
            ? resize.args[1] + 0.1
            : incrementX == 'negative' && resize.args[0] > 0.2
            ? resize.args[1] - 0.1
            : resize.args[1],
          incrementY == 'positive'
            ? resize.args[2] + 0.1
            : incrementY == 'negative'
            ? resize.args[2] - 0.1
            : resize.args[2]
        ]
        setSize({ args: cylinderArgs, index: index, isResize: true, sizeTool:'cursor'  })
        return
      case 'SphereGeometry':
        let sphereArgs = [
          incrementX == 'positive' || incrementY == 'positive'
            ? resize.args[0] + 0.1
            : (incrementX == 'negative' || incrementY == 'negative') &&
              resize.args[0] > 0.2
            ? resize.args[0] - 0.1
            : resize.args[0],
          resize.args[1],
          resize.args[2]
        ]
        setSize({ args: sphereArgs, index: index, isResize: true, sizeTool:'cursor'  })
        return
      default:
        return
    }
  }

  const EditableText = () => {
    return (
      <Html>
       <div
        style = {{
          width: '400px',
          minHeight: '100px',
          maxHeight: '100px',
          whiteSpace: 'nowrap',
          overflowY: 'scroll',
          border: '1px solid black',
          }}
          ref = {divRef}
          autoFocus
          onMouseOver={(e)=>{
            editContent.current.focus()
        }}
          onKeyDown={(e:any)=>{
          if(e.ctrlKey && e.code == 'KeyS'){
            let translate = e.target.offsetParent.attributes.style.value.split('translate')
            console.log(translate)
            let position = translate && translate.length > 1 ?e.target.offsetParent.attributes.style.value.split('translate')[1].match(/\d+/g):[0,0]
            isEditableDiv(false)
            e.target.innerText != '' && setTextArray([...textArray, {text:e.target.innerText, opacity:1, left:position[0], top:position[1], color:'black',fontFamily:'serif',fontSize:'15px'}])
            divRef.current.remove()
          } 
        }}>
         <button contentEditable={false} style = {{position:'relative',float:'right', marginTop: '0px', width: '30px', height:'20px'}} onClick = {(e)=>{
          divRef.current.remove()
          isEditableDiv(false)
        }}><ClearIcon fontSize="inherit"/></button>
        <div contentEditable ref= { editContent} 
          className='editText'
          style={{marginTop:'20px', marginBottom:'-50px', height:'80px', color:'black', fontFamily:'serif', fontSize:'15px'}}></div>
      </div>
      </Html>
    )
  }

  const setText = () => {
    var tx = document.getElementsByClassName('comment-area-responsive');
    for (var i = 0; i < tx.length; i++) {
      tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
    }
  }
  
  const text = () =>{
    return(
    textArray 
    .map((t:any,i)=> 
          <Html  key ={i} >
           <Draggable>
            <div id ={'text'+i} style={{left:t.left, top:t.top ,minWidth:'100px'}} 
              onPointerOver ={(e)=>{setTextArray(textArray.map((t:any,index:number)=> {
                if (index == i) {
                  return {...t,opacity:1}
                } else {
                  return t;
                }
              }))}}
              onPointerOut ={(e)=>{setTextArray(textArray.map((t:any,index:number)=> {
                if (index == i) {
                  return {...t,opacity:0}
                } else {
                  return t;
                }
              }))}}>
             
              <div style={{opacity:t.opacity, zIndex:10}} >
              <button contentEditable={false}  style = {{position:'relative',float:'right', marginTop: '0px',opacity:t.opacity, height:'27px'}}
              onClick = {(e)=>{ 
                setTextArray(textArray.filter((t:any, index:number)=> index != i))
                setSelected({name:'canvas', index:-1, elements:null})
              }}>
                <ClearIcon fontSize="inherit"/></button>
                <button contentEditable={false}  style = {{position:'relative',marginTop: '0px',opacity:t.opacity, height:'27px'}}
              onClick = {(e)=>{ 
                setSelected({name:'text', index:i, elements:textArray})
              }}>
                <DetailsIcon fontSize="inherit"/></button>
                </div>
              <p contentEditable suppressContentEditableWarning={true} style={{width:'max-content', whiteSpace:'pre-wrap', lineHeight:'20px', color:t.color, fontFamily:t.fontFamily, fontSize:t.fontSize}}
              onKeyDown={(e:any)=>{ 
                if(e.code == 'KeyS' && e.ctrlKey){
                  if(e.target.innerText == ''){
                    setTextArray(textArray.filter((t:any, index:number)=> index != i))
                  }
                  else{
                    setTextArray(textArray.map((t:any,index:number)=> {
                      if (index == i ) {
                        return {...t,text:e.target.innerText}
                      } else {
                        return t;
                      }
                    }))
                  }
                }
              }}
                onPointerUp = {(e:any)=>{
                  setTextArray(textArray.map((t:any,index:number)=> {
                    if (index == i) {
                      let result = (e.target.offsetParent.attributes.style.value.split('translate')[1].match(/\d+/g)).map((n:any) => parseInt(n));
                      console.log(result)
                      return {...t,left:result[0],top:result[1]}
                    } else {
                      return t;
                    }
                  }))
                 }} >{t.text}
            </p></div></Draggable></Html>
          ));
  }

  return (
    <div style={{ height: props.height }}>
      <div
        style={{
          marginLeft:'10%',
          marginRight:'10%',
          width: '80%',
          height: '80px',
          display: 'flex',
          overflowX: 'auto',
        }}
        id="properties">
        {geometry.map((element, i) => {
          return (
            <>
              <div style={{ float: 'left', width: '10%' }}>
                <Canvas camera={{ position: [0, 0, 2] }}>
                  <ambientLight intensity={1} ></ambientLight>
                  <pointLight intensity={1} position={[1, 1, 1]} />
                  <Html>
                  <div
                  style={{
                  width: 'fitcontent',
                  color: 'grey',
                  display: 'flex',
                  verticalAlign: 'middle',
                  marginLeft:'20px',
                  marginTop:'-20px'
                }}>
                  <CommonMenu geometry={geometry} index={i} cloneElement={cloneElement} setColor={setColor}/>
                  </div>
                  </Html>
                  <StaticMesh element={element} i = {i}/>
                </Canvas>
              </div>
            </>
          )
        })}
      </div>
      
      <div style={{ position: 'relative' }}>
      <div
        style={{
          width: '10%',
          height: '500px',
          float: 'left',
          overflow: 'auto',
          margin:'1%',
          marginTop:'2%',
        }}>
      <LeftPane selected={selected} setColor={setColor} EditableText={EditableText} setEditableDiv={setEditableDiv} setFontSize={setFontSize} setFont={setFont} setWireFrame={setWireFrame}
      setElementSize={setElementSize} setAutoRotate = {setAutoRotate}/>
      </div>
      <div style={{marginTop:'-2%'}}>
      <div style={{float:'left', marginLeft:'-8%'}}>
          Previous
      </div>
      <div style={{marginLeft:'90%'}}>
          Next
      </div>
      </div>
        <Canvas
          ref={canvasRef}
          style={{
            width: '75%',
            height: '500px',
            float:'left',
            marginTop:'1%',
          }}
          onClick={()=>{
            let ref = canvasRef.current
            console.log(ref.toDataURL())
            setCanvasURL(ref.toDataURL())}}
          onContextMenu={(e)=>{
            e.nativeEvent.preventDefault()
            isEditableDiv(false)
            setLastPosition([e.clientX - 600,e.clientY - 500])
            contextMenu == null && handleTextMenu(e)
          }}>
          <ambientLight intensity={1} ></ambientLight>
          <pointLight intensity={2} position={[1,1,1]} />
      {elements &&
      elements.length > 0 &&
      elements.map((e, i) => {
      if (e.name != '') {
      return (
      <>
      <mesh
      position={e.intersections.position}
      rotation={
        i == rotation.index
          ? [rotation.x, rotation.y, rotation.z]
          : e.intersections.rotation
        }

      onContextMenu={(e) => {
        e.nativeEvent.preventDefault()
        handleContextMenu(e, i)
      }}
      onPointerMove={(event) => {
        document.body.style.cursor = 'crosshair'
        if (
          dragging &&
          (!rotation.isRotate || !rotation.isRotateZ) &&
          rotation.index != i &&
          !resize.isResize &&
          resize.index != i
        ) {
          findIndex(event, i)
        } else {
          if (
            (rotation.isRotate || rotation.isRotateZ) &&
            rotation.index == i
          ) {
            setElementRotation(event, i)
          }
          if (resize.isResize && resize.index == i && resize.sizeTool == 'cursor') {
            setElemetArgs(event, i)
          }
        }
        setLastPosition([event.point.x, event.point.y])
      }}
      onPointerDown={(event) => {
        if (
          join == true &&
          e.name + e.id == elements[i].name + elements[i].id &&
          intersectingIndex[intersectingIndex.length - 1] != i
        ) {
          intersectingIndex.push(i)
          mergeElements(e)
        }
        if (event.eventObject.name == '') {
          event.eventObject.name = e.name + e.id
        }
        console.log(event.eventObject)
        if (event.intersections[0].eventObject.name != '') {
          setDraggedElement(event.eventObject.name)
          setLastPosition([event.point.x, event.point.y])
          isdragging(true)
        }
      }}
      onPointerUp={(event) => {
        console.log(event.eventObject)
        if (i == rotation.index) {
          e.intersections.rotation = [
            rotation.x,
            rotation.y,
            rotation.z
          ]
        }
        if (i == resize.index && resize.sizeTool == 'cursor') {
          e.args = resize.args
        }
        setRotation({
          x: rotation.x,
          y: rotation.y,
          z: rotation.x,
          isRotate: false,
          isRotateZ: false,
          index: -1
        })
        setSize({ args: [], index: -1, isResize: false , sizeTool:'cursor' })
        if (dragging) {
          //findIndex(event)
          let x = event.point.x
          let y = event.point.y
          if (event.eventObject.name == draggedElement) {
            e.intersections.position.x =
              event.eventObject.position.x
            e.intersections.position.y =
              event.eventObject.position.y
          }
          event.eventObject.name = e.name + e.id
          event.eventObject.userData = e.intersections
          e.intersections.boundaries = getBoundaries(
            event,
            i,
            false
          )
          event.eventObject.userData.boundaries =
            e.intersections.boundaries
          if (elements && elements.length >= 2) {
            elements.filter((ele, index) => {
              if (ele.name + ele.id == event.eventObject.name) {
                intersectingIndex.push(index)
              }
              if (
                event.eventObject.userData.isintersect ==true &&
                ele.name + ele.id != event.eventObject.name &&
                ele.intersections.isintersect == true &&
                ele.intersections.intersectionName ==
                  event.eventObject.userData.intersectionName
              ) {
                let diffY = Math.abs(
                  y - ele.intersections.position.x
                )
                let diffX = Math.abs(
                  x - ele.intersections.position.x
                )
                ele.intersections.position.y =
                  y > ele.intersections.position.y
                    ? event.point.y + diffY
                    : event.point.y - diffY
                ele.intersections.position.x =
                  x > ele.intersections.position.x
                    ? event.point.x + diffX
                    : event.point.x - diffX
              }
        })
          }
        }
        setIntersectingIndex([-1])
        isdragging(false)
      }}>
      <e.name args={i == resize.index ? resize.args : e.args} />
      <meshStandardMaterial
      color={e.color}
      wireframe={e.wireframe}
      />
      <Html>
      </Html>
      {
      }
    </mesh>
                </>
              )
              }
            })
          }
          {editableDiv && EditableText()}
          { textArray && textArray.length > 0  && text()}
          <color attach="background" args={[canvas[0].color]} />
        </Canvas>
        <div
        style={{
          width: '10%',
          height: '500px',
          overflow: 'auto',
          margin:'1%',
          float:'left',

        }}>
        <Preview  canvas={canvas} elements={elements}/>
      </div>
        <Menu 
        open={ textMenu !== null }
        onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            textMenu !== null
              ? { top: textMenu.mouseY, left: textMenu.mouseX }
              : undefined
          }>
            <MenuItem 
              onClick ={(e)=>{
              handleClose()
            setSelected({name:'canvas', index:-1, elements:null})}}>Edit</MenuItem>
        </Menu>
        <Menu
          open={contextMenu !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
          PaperProps={{
            style: {
              maxHeight: `100px`,
              overflowY: 'scroll'
            }
          }}
          >
          <MenuItem onClick={()=>{setSelected({name:'element', index:contextMenu?contextMenu.index:0, elements:elements})
            handleClose()}}>Edit</MenuItem>
          <MenuItem
            onClick={(e) =>
              detachElement(e, contextMenu?.index, contextMenu?.contextEvent)
            }>
            Detach
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              showJoin(true)
              contextMenu && setIntersectingIndex([...intersectingIndex,contextMenu.index])
              handleClose()
            }}>
            Attach
          </MenuItem>
          <MenuItem
            onClick={() => {
              setRotation({...rotation,
                x: rotation.x,
                y: rotation.y,
                z: rotation.z,
                isRotate: true,
                isRotateZ: false,
                index: contextMenu? contextMenu.index : 0
              })
              handleClose()
            }}>
            Rotate
          </MenuItem>
          <MenuItem
            onClick={() => {
              setRotation({...rotation,
                x: rotation.x,
                y: rotation.y,
                z: rotation.z,
                isRotate: false,
                isRotateZ: true,
                index: contextMenu?  contextMenu.index : 0
              })
              handleClose()
            }}>
            Rotate-Z
            </MenuItem>
          <MenuItem
            onClick={() => {
              contextMenu &&
              setSize({...resize, args: elements[contextMenu.index].args,
              index:  contextMenu ? contextMenu.index : 0,
              isResize: true})
              handleClose()
            }}>
            ReSize
          </MenuItem>
          <MenuItem
            onClick={() => {
              contextMenu &&
              elements.splice(contextMenu.index,1)
              setSelected({name:'canvas', index:-1, elements:null})
              handleClose()
            }}>
            Delete
          </MenuItem>
        </Menu>
      </div>
    </div>
    
  )
}
