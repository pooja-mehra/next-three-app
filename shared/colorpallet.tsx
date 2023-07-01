
import {IconButton, Typography} from '@mui/material';
import { useEffect, useState, useRef,RefObject } from 'react';

export default function ColorPallet(props:any){
    const {elements, index } = props
    const [color, setColor] = useState(index == -1 ?'#ff6d6d':elements[index].color)
    return(
    <div>
        <input type="color" id="head" name="head"
           value={color} onChange={e => 
           {
            setColor(e.target.value)
            props.setColor(color,index)
           }} />
    </div>     
    );
}