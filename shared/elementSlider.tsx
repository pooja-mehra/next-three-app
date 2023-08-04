import Stack from '@mui/material/Stack'
import { useState, useEffect } from 'react'
import Slider from '@mui/material/Slider';

export default function ElementSlider(props:any){
    const {selected, maxRange} = props
    const [value, setValue] = useState<any>({value:0.1,name:''});
    const handleChange = (event: any, newValue: number | number[]) => {
    setValue({value:newValue, name:event.target?parseInt(event.target.name):''})
    props.setElementSize(newValue,event.target && parseInt(event.target.name), selected.elements, selected.index)
    }

    const Sliders = (props:any):any => {
      const {range,labels,args, rotationArgs} = props
      let sliderArray = Array.from({ length: range }, (value, index) => value);
      return (
        sliderArray.map((s,i)=>{
        return(<Stack spacing={5} style={{ margin: '10%' }} key={i}>
          <Slider aria-label="Volume" value={value.name == i? value.value : i<3 ?args[i]: rotationArgs[i]} onChange={handleChange} name={i.toString()} min={0.1}
          marks step={labels[i]=='angle'?1:.5} max={labels[i]=='angle'?20:5} style={{width:'200px', overflowX:'auto' }}/>{labels[i]} 
        </Stack>)
      }))
    }
    switch (selected.elements[selected.index].name) {
      case 'BoxGeometry':
        return(<>
          <Sliders range={6} labels={['Length', 'Height','Width', 'Rotate X', 'Rotate Y', 'Rotate Z']} args={selected.elements[selected.index].args} rotationArgs={selected.elements[selected.index].intersections.rotation}/>
        </>)
      case 'CylinderGeometry':
        return(<>
          <Sliders range={6} labels={['Top Radius','Base Radius','Height', 'Rotate X', 'Rotate Y', 'Rotate Z']} args={selected.elements[selected.index].args} rotationArgs={selected.elements[selected.index].intersections.rotation}/>
        </>)
      case 'SphereGeometry':
        return(<>
          <Sliders range={1} labels={['Radius']} args={selected.elements[selected.index].args} rotationArgs={selected.elements[selected.index].intersections.rotation}/>
        </>)
         case 'ConeGeometry':
          return(<>
            <Sliders range={6} labels={['Radius','Height', 'angle','Rotate X', 'Rotate Y']} args={selected.elements[selected.index].args} rotationArgs={selected.elements[selected.index].intersections.rotation}/>
          </>)
          case 'TorusGeometry':
            return(<>
              <Sliders range={1} labels={['Radius']} args={selected.elements[selected.index].args} rotationArgs={selected.elements[selected.index].intersections.rotation}/>
            </>)
      default:
        return (<Stack spacing={0}>
        </Stack>)
    }
}