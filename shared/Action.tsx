
import Stack from '@mui/material/Stack'
import ColorPallet from './colorpallet'
import { useState, useEffect } from 'react'
import Slider from '@mui/material/Slider';
import Font from './font';
import Checkbox from '@mui/material/Checkbox';
import { animated, useSpring } from 'react-spring';
import ElementSlider from './elementSlider';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
export default function Action(props:any){
  const {selected} = props
    return (
    <div style={{textAlign:'center'}}>
       <FormControl>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="hover" control={<Radio onChange={()=>selected && props.setActions(selected.elements,selected.index,'hover')} /> } label="on hover" />
        <FormControlLabel value="click" control={<Radio />} label="on click" />
        <FormControlLabel value="auto" control={<Radio />} label="auto" />
      </RadioGroup>
    </FormControl>
    </div>)
}