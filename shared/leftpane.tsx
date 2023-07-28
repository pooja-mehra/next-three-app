
import Stack from '@mui/material/Stack'
import ColorPallet from './colorpallet'
import { useState, useEffect } from 'react'
import Slider from '@mui/material/Slider';
import Font from './font';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { animated, useSpring } from 'react-spring';
import ElementSlider from './elementSlider';

export default function LeftPane(props:any){
    const Boop = ({
        x = 0,
        y = 0,
        rotation = 0,
        scale = 1,
        timing = 150,
        children =<></>
      }) => { 
        const [isBooped, setIsBooped] = useState(false);
        const style:any = useSpring({
          display: 'inline-block',
          backfaceVisibility: 'hidden',
          transform: isBooped
          ? `translate(${x}px, ${y}px)
             rotate(${rotation}deg)
             scale(${scale})`
          : `translate(0px, 0px)
             rotate(0deg)
             scale(1)`,
          config: {
            tension: 300,
            friction: 10,
          },
        });
    
    useEffect(() => {
        if (!isBooped) {
          return;
        }
        const timeoutId = window.setTimeout(() => {
          setIsBooped(false);
        }, timing);
        return () => {
          window.clearTimeout(timeoutId);
        };
      }, [isBooped, timing]);

      const trigger = () => {
        setIsBooped(true);
      };

      
      return (
        <animated.span onMouseEnter={trigger} style={style}>
          {children}
        </animated.span>
      )
      }

    const AddText = () =>{
      return (
        <div onClick={()=>props.setEditableDiv(true)}>Add Text</div>
      )
    }

    const {selected} = props
    
    switch(selected?selected.name:'canvas'){
        case 'canvas':
            return(
                <div style={{textAlign:'center'}}>
                <Stack spacing={5} style={{ margin: '10%' }}>
                    <ColorPallet elements={null} index ={-1} setColor={props.setColor} />
                </Stack>
                <Stack spacing={5} style={{ margin:'10%', marginTop: '20%', }}>
                    <Boop rotation={20} timing={200} scale={1.5}>
                      <AddText />
                    </Boop>
                </Stack>
                </div>)
        case 'element':
            return (
                <div style={{textAlign:'center'}}>
                <Stack spacing={5} style={{ margin: '10%'}}>
                    <ColorPallet elements={selected.elements} index ={selected.index} name={selected.name} setColor={props.setColor}/>
                </Stack>
                <Stack spacing={5} style={{ margin: '15%' }}>
                    <Checkbox checked={selected.elements[selected.index].wireframe} onChange={()=>{
                        props.setWireFrame(selected.elements,selected.index,true)}}/>Wireframe
                </Stack>
                <ElementSlider selected={selected} maxRange={10} setElementSize ={props.setElementSize} stopResize={props.stopResize}/>
                </div>)
            
        case 'text':
                return (
                    <div style={{textAlign:'center'}}>
                    <Stack spacing={5} style={{ margin: '10%' }}>
                        <ColorPallet elements={selected.elements} index ={selected.index} name={selected.name} setColor={props.setColor} />
                    </Stack>
                    <Stack spacing={5} style={{ margin: '20%' }}>
                    <Font index={selected.index} elements={selected.elements} setFont={props.setFont} setFontSize ={props.setFontSize}/>
                    </Stack>
                    </div>)
        default:
            return(
                <div style={{textAlign:'center'}}>
                <Stack spacing={5} style={{ margin: '10%' }}>
                    <ColorPallet elements={null} index ={-1} name={selected.name} setColor={props.setColor} />
                </Stack>
                <Stack spacing={5} style={{ margin:'10%', marginTop: '10%', }}>
                    <div onClick={()=>props.setEditableDiv(true)}  >Add Text</div>
                </Stack>
                </div>)
        }
    }

    /*
    <Stack spacing={5} style={{ margin: '15%' }}>
                    <Checkbox checked={selected.elements[selected.index].autoRotate} onChange={()=>{
                        props.setAutoRotate(selected.elements,selected.index,true)}}/>AutoRotate
                </Stack>*/