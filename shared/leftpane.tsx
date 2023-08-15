
import Stack from '@mui/material/Stack'
import ColorPallet from './colorpallet'
import { useState, useEffect } from 'react'
import Font from './font';
import Checkbox from '@mui/material/Checkbox';
import { animated, useSpring } from 'react-spring';
import ElementSlider from './elementSlider';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

export default function LeftPane(props:any){
    const[wireframe,setWireframe] = useState(false)
    const[actionSequence,setActionSequence] = useState(false)
    const[isText,setText] = useState(false)
    const [textValue,setTextValue] = useState('')
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
  const [action, setAction] = useState('default');

  const handleChange = (event: SelectChangeEvent) => {
    setActionSequence(false)
    setText(false)
    setAction(event.target.value as string);
    //selected && props.setActions(selected.elements,selected.index,event.target.value)
  };
    const ActionSelect = () =>{
      return(
      <div>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Action</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          defaultValue={'default'}
          value={action}
          label="Action"
          onChange={handleChange}
        >
          <MenuItem value={'default'}>Default</MenuItem>
          <MenuItem value={'click'}>Click</MenuItem>
          <MenuItem value={'hover'} >Hover</MenuItem>
        </Select>
      </FormControl>
    </div>
      )
    }
    switch(selected?selected.name:'canvas'){
        case 'canvas':
            return(
                <div style={{textAlign:'center'}}>
                  <Stack spacing={5} style={{ margin: '10%' }}>
                    <ActionSelect />
                  </Stack>
                <Stack spacing={5} style={{ margin: '10%' }}>
                    <ColorPallet elements={null} action={action} index ={-1} setColor={props.setColor} />
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
                  <Stack spacing={5} style={{ margin: '10%' }}>
                    <ActionSelect />
                  </Stack>
                  <Stack spacing={5} style={{ margin: '10%' }}>
                      <Checkbox checked={actionSequence} onChange={()=>{setActionSequence(!actionSequence)
                            props.setActionSequence(selected.elements,selected.index,action,!actionSequence)}}/>Sequence
                  </Stack>
                <Stack spacing={5} style={{ margin: '10%'}}>
                    <ColorPallet elements={selected.elements} index ={selected.index} name={selected.name} action={action} setColor={props.setColor}/>
                </Stack>
                <Stack spacing={5} style={{ margin: '15%' }}>
                    <Checkbox checked={wireframe} onChange={()=>{setWireframe(!wireframe)
                        props.setWireFrame(selected.elements,selected.index,action)}}/>Wireframe
                </Stack>
                <ElementSlider selected={selected} maxRange={10} setElementSize ={props.setElementSize} action={action} stopResize={props.stopResize}/>
                </div>)
            
        case 'text':
                return (
                    <div style={{textAlign:'center'}}>
                    <Stack spacing={5} style={{ margin: '10%' }}>
                      <ActionSelect />
                    </Stack>
                    <Stack spacing={5} style={{ margin: '10%' }}>
                        <ColorPallet elements={selected.elements} index ={selected.index} name={selected.name} action={action} setColor={props.setColor} />
                    </Stack>
                    <Stack spacing={5} style={{ margin: '20%' }}>
                    <Font index={selected.index} elements={selected.elements} setFont={props.setFont} action={action} setFontSize ={props.setFontSize}/>
                    </Stack>
                    </div>)
        default:
            return(
                <div style={{textAlign:'center'}}>
                  <ActionSelect />
                <Stack spacing={5} style={{ margin: '10%' }}>
                    <ColorPallet elements={null} index ={-1} name={selected.name} action={action}  setColor={props.setColor} />
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
    /*
    {
                      action != 'default' &&
                      <Stack spacing={5} style={{ margin: '15%' }}>
                      <Checkbox checked={isText} onChange={()=>{
                        setText(!isText)
                        props.hideText(selected.elements,selected.index,action)}}/>ShowText
                      </Stack>
                    }
                     <Stack spacing={5} style={{ margin: '15%' }}>
                        <TextField id="outlined-basic" label="Outlined" variant="outlined" onKeyDown={(e:any)=>{
                          props.showText(selected.elements,selected.index,action,e.target.value)
                          }}/>
                     </Stack>*/