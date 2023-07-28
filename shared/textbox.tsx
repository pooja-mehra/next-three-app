import Draggable from "react-draggable";
import ClearIcon from '@mui/icons-material/Clear';
import {
    Text,
    MeshTransmissionMaterial,
    MeshDistortMaterial,
    Html
  } from '@react-three/drei'

export default function TextBox(props:any){
  const {textArray} = props
    return(
        textArray 
        .map((t:any,i:number)=> 
               <Html  key ={i}>
               <Draggable>
                <div id ={'text'+i} style={{top:t.top, left:t.left}} 
                 > 
                  <button contentEditable={false} style = {{position:'sticky',marginBottom: '0px', width: '30px', height:'20px', opacity:t.opacity}}
                    >
                    <ClearIcon fontSize="inherit"/></button>
                  <p contentEditable suppressContentEditableWarning={true} style={{width:'max-content', whiteSpace:'pre-wrap', lineHeight:'20px'}}
                 >{t.text}
                 </p></div></Draggable></Html>
                ));
}