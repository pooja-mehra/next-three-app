import { useState, useRef, useEffect, useMemo} from 'react'
import { animated,useSpring,config } from '@react-spring/three'
import { Canvas, useThree, useFrame} from '@react-three/fiber'
import {MeshDistortMaterial,Html,Text} from '@react-three/drei'
import { Tooltip } from '@mui/material'
import {Vector3} from 'three'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Draggable from "react-draggable";
import ClearIcon from '@mui/icons-material/Clear';
import Geometries from '@/shared/geometries'
import CommonMenu from '@/shared/commonMenu'
import LeftPane from '@/shared/leftpane'
import DetailsIcon from '@mui/icons-material/Details';
import { setInterval } from 'timers'
import Preview from '@/shared/preview'
import Button from '@mui/material/Button';
const AnimatedMeshDistortMaterial:any = animated(MeshDistortMaterial)
import Transition from '@/shared/transition'
import Action from '@/shared/Action'
import { openDB } from 'idb';
import { IndexedDB } from '../services/indexeddb'
import SaveIcon from '@mui/icons-material/Save';
import Published from '@/pages/published';

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
  const [font, setFontStyle] = useState({style:'serif', size:'15px', index:-1})
  const [selected,setSelected] = useState<any>()
  const [wireframe,isWireFrame] = useState(false)
  const [elementText,setElementText] =useState('')
  const [actionSequence,isActionSequence] = useState(false)
  const [autoRotate,isAutoRotate] = useState(false)
  const canvas = useMemo(()=> [{color:'white'}],[])
  var actions =  useMemo(() => new Array(),[])
  var properties =  useMemo(() => new Array(),[])
  const [reload, setReload] = useState(0);

  /*const color = useControls({
    value: 'lightblue',
  })*/
  const [canvasURL,setCanvasURL] = useState('')

  const setEditableDiv = () =>{
    isEditableDiv(true)
  }

  useEffect(()=>{
    IndexedDB().createDB()
  })
  const setColor = (color:string, index:number, element:any, name:string, action:string) =>{
    setNewColor(color)
    if(action == 'default' && !actionSequence){
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
    }  else{
      setActions(name=='text'?textArray:element,index,action,'color',color)
    }
  }

  const setFont = (fontFamily:string, index:number, elements:any,action:string) =>{
    //textArray[index].fontFamily = fontFamily
    //setFontStyle({...font,style:fontFamily, index:index})
    if(action == 'default'){
    setTextArray(textArray.map((t:any,i:number)=> {
      if (index == i) {
        return {...t,fontFamily:fontFamily}
      } else {
        return t;
      }}))
    } else{
      setActions(textArray,index,action,'fontFamily',fontFamily)
    }
  }

  const setFontSize = (size:string, index:number, elements:any,action:string) =>{
    //setFontStyle({...font,size:size, index:index})
    //textArray[index].fontSize = size
    if(action == 'default'){
    setTextArray(textArray.map((t:any,i:number)=> {
      if (index == i) {
        return {...t,fontSize:size}
      } else {
        return t;
      }}))
    } else{
      setActions(textArray,index,action,'fontSize',size)
    }
  }

  const setWireFrame = (element:any,index:number,action:string) =>{
    isWireFrame(!wireframe)
    if(action == 'default'  && !actionSequence){
      element[index].wireframe = !wireframe
    } else{
      setActions(element,index,action,'wireframe',!wireframe)
    }
  }
  
  const setActionSequence = (element:any,index:number,action:string,isSequence:boolean) =>{
      isActionSequence(isSequence)
      setActions(element,index,action,'sequence',isSequence)
  }
  const [interval,addInterval] = useState(null as NodeJS.Timeout | null)

  const setAutoRotate = (element:any,index:number) =>{
    isAutoRotate(!element[index].autoRotate)
    element[index].autoRotate = !element[index].autoRotate
    //if(!autoRotate){
    const interval = setInterval(() => {
    }, 500);
    setTimeout(() =>{
      clearInterval(interval), 5000})
    }

  const rotate = (element:any,index:number) =>{
    setRotation({
      x: element[index].intersections.rotation[0] += 0.5,
      y: element[index].intersections.rotation[1] += 0.5,
      z: element[index].intersections.rotation[1] += 0.5,
      isRotate:true,
      isRotateZ: false,
      index: index,
      rotationTool:'cursor'
    })
  }

  const setElementSize = (size:number, name:number, element:any,index:number,action:string) =>{
    if([0,1,2].includes(name)){
      let args = []
      name == 0? args.push(size,element[index].args[1],element[index].args[2]): name == 1 ? args.push(element[index].args[0],size,element[index].args[2]) : args.push(element[index].args[0],element[index].args[1],size)
      if(action =='default' && !actionSequence){
        setSize({args:args, index:index, isResize: true, sizeTool:'slider' })
        element[index].args = args
      } else{
        setActions(element,index,action,'args',args)
      }
    } else{
      let rotaionArgs = []
      element[index].intersections.rotation[name] = size
      name == 3? rotaionArgs.push(size,element[index].intersections.rotation[1],element[index].intersections.rotation[2]): 
      name == 4 ? rotaionArgs.push(element[index].intersections.rotation[0],size,element[index].intersections.rotation[2]) : 
      rotaionArgs.push(element[index].intersections.rotation[0],element[index].intersections.rotation[1],size)
      if(action =='default' && !actionSequence){
      setRotation({
        x: rotaionArgs[0],
        y: rotaionArgs[1],
        z: rotaionArgs[2],
        isRotate:true,
        isRotateZ: false,
        index: index,
        rotationTool:'slider'
      })} else{
        setActions(element,index,action,'rotation',rotaionArgs)
      }
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
  
  function MainMesh(props:any){
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
    index: -1,
    rotationTool:'cursor'
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
      record:false,
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

  function findIndex(event: any, elementIndex: number){
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
        case 'ConeGeometry':
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
        case 'TorusGeometry':
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
          index: index ? index : 0,
          rotationTool:'cursor'
        })
      : setRotation({
          x: rotation.x,
          y: rotation.y,
          z: rotation.z,
          isRotate: true,
          isRotateZ: false,
          index: index ? index : 0,
          rotationTool:'cursor'
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
        case 'ConeGeometry':
        let coneArgs = [
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
        setSize({ args: coneArgs, index: index, isResize: true, sizeTool:'cursor'  })
        return
        case 'TorusGeometry':
        let torusArgs = [
          incrementX == 'positive' || incrementY == 'positive'
            ? resize.args[0] + 0.1
            : (incrementX == 'negative' || incrementY == 'negative') &&
              resize.args[0] > 0.2
            ? resize.args[0] - 0.1
            : resize.args[0],
          resize.args[1],
          resize.args[2]
        ]
        setSize({ args: torusArgs, index: index, isResize: true, sizeTool:'cursor'  })
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
        }}>
          <button contentEditable={false} style = {{position:'relative',float:'right', marginTop: '0px', width: '30px', height:'20px'}} onClick = {(e)=>{          
          divRef.current.innerText != '' && setTextArray([...textArray, {id:Date.now(),name:'text',text:divRef.current.innerText, opacity:1, left:0, top:0, color:'black',fontFamily:'serif',fontSize:'15px'}])          
          isEditableDiv(false)
          divRef.current.remove()
        }}><SaveIcon fontSize="inherit"/></button>
         <button contentEditable={false} style = {{position:'relative',float:'left', marginTop: '0px', width: '30px', height:'20px'}} 
         onClick={()=>{isEditableDiv(false)
         divRef.current.remove()}}><ClearIcon fontSize="inherit"/></button>
        <div contentEditable ref= { editContent} 
          className='editText'
          style={{marginTop:'20px', marginBottom:'-50px', height:'80px', color:'black', fontFamily:'serif', fontSize:'15px'}}></div>
      </div>
      </Html>
    )
  }

  const setPreviewText =(isText:boolean)=>{
    setEditText(!isText)
  }

  const PreviewText = (props:any) =>{
    const { children, position, scale, color, fontSize, fontFamily, opacity} = props 
    var canvas = document.createElement('canvas')
    var context:any = canvas.getContext('2d')
    context.textBaseline = 'left'
    context.font = `${fontSize}px ${fontFamily}`
    var metrics = context.measureText(children)
    var textWidth = metrics.width
    context.fillStyle = color
    context.fillText(children, textWidth - textWidth * 0.8, fontSize)
    return (
      <sprite  scale={scale} position={position}>
        <spriteMaterial sizeAttenuation={false} attach="material" alphaTest={0.3} opacity={opacity} color={color}>
          <canvasTexture attach="map" image={canvas} />
        </spriteMaterial>
      </sprite>
    )
  }

  const [editText,setEditText] = useState(true)
  const text = () =>{
    return(
    textArray 
    .map((t:any,i)=>
    <>
    {
       t.text.split('\n').map((pt:any,j:number)=> 
        <PreviewText scale={new Vector3(1,0.5,1)}  position={new Vector3(t.left == 0? 2: 2 + t.left/80 ,t.top == 0? -1.5 + j/3: -1.5 - t.top/80 + j/3,1)} key ={'previewtext'+i +'subtext'+j} 
        fontSize={parseInt(t.fontSize)} color= {t.color} fontFamily ={t.fontFamily} opacity={editText ? 0 : 1} >
        {pt}
        </PreviewText>
      )
    }
    <Html key ={t.name+t.id}>
      <Draggable>
        <div id ={t.name+t.id} style={{left:t.left, top:t.top ,minWidth:'100px', opacity:editText ? 1 : 0}}
          onPointerOver ={(e)=>{
          setEditText(true)
          setTextArray(textArray.map((t:any,index:number)=> {
          if (index == i) {
            return {...t,opacity:1}
          } else {
            return t;
          }}))}}
          onPointerUp = {(e:any)=>{
            setSelected({name:'text', index:i, elements:textArray})
            setTextArray(textArray.map((t:any,index:number)=> {
              if (index == i) {
                let divID:any = document.getElementById(t.name+t.id)
                let result = (divID.style.cssText.split('translate')[1].match(/-?\d+/g)).map((n:any) => parseInt(n));
                return {...t,left:result[0],top:result[1]}
              } else {
                return t;
              }
            }))
           }}
              onPointerOut ={(e)=>{setTextArray(textArray.map((t:any,index:number)=> {
                setEditText(false)
                if (index == i) {
                  return {...t,opacity:0}
                } else {
                  return t;
                }
              }))}} >
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
                <button contentEditable={false}  style = {{position:'relative',float:'left', marginTop: '0px',opacity:t.opacity, height:'27px'}}
                onClick = {(e)=>{ 
                  let divID:any = document.getElementById('text'+i)
                  if(divID.innerText== ''){
                    setTextArray(textArray.filter((t:any, index:number)=> index != i))
                  }
                  else{
                    setTextArray(textArray.map((t:any,index:number)=> {
                      if (index == i ) {
                        return {...t,text:divID.innerText}
                      } else {
                        return t;
                      }
                    }))
                  }
                setSelected({name:'canvas', index:-1, elements:null})
              }}>
                <SaveIcon fontSize="inherit"/></button>
              </div>
              <p contentEditable suppressContentEditableWarning={true} style={{position:'relative', width:'max-content',
              whiteSpace:'pre-wrap', lineHeight:'20px', color:t.color, fontFamily:t.fontFamily, fontSize:t.fontSize}}
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
              >{t.text}
            </p></div>
          </Draggable>
            </Html> 
            </>
          ));
  }
  const[sequence,showSequence] = useState(false)
  const setSequence = (isSequence:boolean)=>{
    showSequence(isSequence)
  }
  const [record,setRecord] = useState(new Array())
 
  const ScreenshotButton = () =>{
    const { gl, scene, camera } = useThree()  
      function ScreenShot(){
      setEditText(false)
      setTimeout(()=>{
        gl.render(scene, camera)
        gl.domElement.toBlob(
          function(blob:any) {
            const image:any = document.getElementById('img');
            const imgDiv:any = document.getElementById('imgdiv');
            imgDiv.style.opacity = 1
            //var a = document.createElement('a')
            var url = URL.createObjectURL(blob)
            image.src = url
            //a.download = 'canvas.jpg'
            ///a.click()
            image.addEventListener("mouseenter", function () {
              image.style.transform = 'scale(2)'
          });
          image.addEventListener("mouseleave", function () {
            image.style.transform = 'scale(1)'
          });
          },
          'image/jpg',
          1.0
        )
      },500)
     }
     function Record(){
      setRecord(elements.map((e,i)=>{return i}))
      let stream =canvasRef.current.captureStream() 
      const video:any = document.querySelector('video');
      const rec = new MediaRecorder(stream, { mimeType: 'video/webm' })
      const imgDiv:any = document.getElementById('imgdiv');
      imgDiv.style.opacity = 1
      rec.start()
      rec.addEventListener('dataavailable', e => {
        let url = URL.createObjectURL(e.data)
        video.src = url
      })

      for (let count = 0; count < record.length; count++) {
        setTimeout(() => {
          setRecord(record.filter((r,index)=>index !== 0))
      },count*500)
      }
      
      setTimeout(()=>{
          rec.stop()
        },elements.length*2000)
      }
      gl.domElement.toDataURL()
      return (
        <Html> 
          <div style={{position:'fixed',marginTop:2*canvasRef.current.clientHeight/5+'px', marginLeft:2*canvasRef.current.clientWidth/5+'px'}}>
          <Tooltip title={'Save Slide'}>
          <Button variant="contained" onClick={()=>{IndexedDB().addToDB('actions',actions).then(sequence?Record:ScreenShot)
            }} color="inherit">Save</Button>
          </Tooltip>
          </div>
        </Html>
      );
}
const [active,setActive] = useState(false)
const { scale, transition } = useSpring({
  transition:0.1,
  scale: active ? 1.5 : 1,
  config: config.wobbly
});

const showText = (element:any,index:number,action:string,text:string) =>{
  setElementText(text)
  if(action == 'default' && !actionSequence){
    element[index].text = text
  } else{
    setActions(element,index,action,'text',text)
  }
}

const hideText =(element:any,index:number,action:string) =>{
  setActions(element,index,action,'text','')
}

const setActions = async(selectedElement:any,index:number,actionType:string,propertyName:string,property:any)=>{
  let actionMap = new Map()
  let action = actions.filter((a:any,i:number)=>
    a.has(selectedElement != null ?selectedElement[index].name+selectedElement[index].id:'canvas'))
  if(action && action.length > 0){
    const items = action[0].values()[Symbol.iterator]();
    for (const item of items) {
      if(item.has(actionType)){
        [...item.get(actionType).keys()].includes(propertyName) && item.get(actionType).delete(propertyName)
        let propMap = item.get(actionType)
        propMap.set(propertyName,property)
      } else{
        let propMap = new Map()
        propMap.set(propertyName,property)
        item.set(actionType,propMap)
      }
    }
  } else {
    let newActionMap = new Map()
    newActionMap.set('createElement',selectedElement!= null?selectedElement.filter((e:any,i:number)=>i==index)[0]:canvas[0])
    let propMap = new Map()
    propMap.set(propertyName,property)
    newActionMap.set(actionType,propMap)
    actionMap.set(selectedElement!= null?selectedElement[index].name+selectedElement[index].id:'canvas',newActionMap)
  }
  actionMap.size>0 && actions.push(actionMap)
  actions && actions.length > 0 && IndexedDB().addToDB('actions',actions)
  setReload(reload+1)
}
  const publishRef = useRef<any>(null)
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
              <div style={{ float: 'left', width: '10%' }}  key ={i}>
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
                  <CommonMenu geometry={geometry} index={i} cloneElement={cloneElement}/>
                  </div>
                  </Html>
                  <StaticMesh element={element} i = {i}/>
                </Canvas>
              </div>
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
        }}>
      <LeftPane selected={selected} setColor={setColor} EditableText={EditableText} setEditableDiv={setEditableDiv} setFontSize={setFontSize} setFont={setFont} setWireFrame={setWireFrame}
      setElementSize={setElementSize} setAutoRotate = {setAutoRotate} showText={showText} hideText={hideText} setActionSequence={setActionSequence}/>
      </div>
        <Canvas
          ref={canvasRef}
          id={'canvas'}
          style={{
            width: '75%',
            height: '500px',
            float:'left',
            margin:'1%',
          }}
          onContextMenu={(e)=>{
            e.nativeEvent.preventDefault()
            isEditableDiv(false)
            setLastPosition([e.clientX - 600,e.clientY - 500])
            contextMenu == null && handleTextMenu(e)
          }}>
          <ScreenshotButton />
          <ambientLight intensity={1} ></ambientLight>
          <pointLight intensity={2} position={[1,1,1]} />
      {editableDiv && EditableText()}
      {textArray && textArray.length > 0 && text()} 
      {elements &&
      elements.length > 0 &&
      elements.map((e, i) => {
        //if(e.name != ''){
        return(<animated.mesh key ={i}
          onClick={() => {
          setActive(true)}}
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
                rotation.index == i && rotation.rotationTool =='cursor'
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
            setSelected({name:'element', index:i, elements:elements})
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
            if (event.intersections[0].eventObject.name != '') {
              setDraggedElement(event.eventObject.name)
              setLastPosition([event.point.x, event.point.y])
              isdragging(true)
            }
          }}
          onPointerUp={(event) => {
            setSelected({name:'element', index:i, elements:elements})
            if (i == rotation.index) {
              e.intersections.rotation = [
                rotation.x,
                rotation.y,
                rotation.z
              ]
            }
            if (i == resize.index) {
              e.args = resize.args
            }
            setRotation({
              x: rotation.x,
              y: rotation.y,
              z: rotation.x,
              isRotate: false,
              isRotateZ: false,
              index: -1,
              rotationTool:'cursor'
            })
            setSize({ args: [], index: -1, isResize: false , sizeTool:'cursor' })
            if (dragging) {
              findIndex(event,i)
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
          <e.name args={i == resize.index ? resize.args : e.args}/>    
          <meshStandardMaterial
          color={e.color}
          wireframe={e.wireframe}
          visible={record && record.length>0 && record.includes(i)?false:true}
          />
          {
            sequence && (
              <Html><input type="number" min={1} max ={elements.length} onChange={(e)=>{
                elements[i].sequence = parseInt(e.target.value)}}></input></Html>
            )
          }
         {
          e.text && e.text != '' && <Text position={[-e.args[0],e.args[0],e.args[0]+1]} 
          fontSize={e.args[0]/2} color={'green'}
          anchorX="center" anchorY="middle">{e.text}</Text>
         } 
        </animated.mesh>)//}
      })
      }
    <color attach="background" args={[canvas[0].color]} />
  </Canvas>
        <div
        style={{
          width: '10%',
          height: '500px',
          overflow: 'auto',
         
        }}>
         <Preview  canvas={canvas} elements={elements} canvasRef ={canvasRef} textArray={textArray} recStarted={setPreviewText} sequence={sequence}/>
      </div>
      <div>
      <div>
      { reload != 0 && <Published reload = {reload} height={'200px'}/> }
      </div>
     
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
              isResize: true, sizeTool:'cursor'})
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
        </Menu>
      </div>
    </div>
    
  )
}
