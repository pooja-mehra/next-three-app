
import {useState} from 'react';

export default function ColorPallet(props:any){
    const {elements, index, name,action } = props
    const [color, setColor] = useState(index == -1 ? elements == null?'black':elements.color:elements[index].color)
    return(
    <div >
        <input type="color" id="head" name="head" style={{width:'100%'}}
           value={color} onChange={e => 
           {
            setColor(e.target.value)
            props.setColor(e.target.value,index,elements,name,action)
           }} 
           />
    </div>     
    );
}