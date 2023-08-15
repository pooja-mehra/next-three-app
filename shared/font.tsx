import { useState } from 'react'

export default function Font(props:any) {
    const {elements, index, action } = props
    const [font, setFont] = useState(elements[index].fontFamily);
    const [fontSize, setFontSize] = useState(parseInt(elements[index].fontSize));
    const fontArray = ['serif','sans-serif','monospace','cursive','fantasy']
    const [changed,isChanged] = useState(false)
    const changeFont = (event: any) => {
    setFont(event.target.value);
    props.setFont(event.target.value,index, elements,action)
    };

    const changeSize = (event: any) => {
        setFontSize(event.target.value);
        props.setFontSize(event.target.value+'px',index, elements,action)
    };

    return (
       <>
        <input type="number" style={{width:'100%'}} value={fontSize}
        placeholder='Size' min={1} max={100} onChange={(e)=>changeSize(e)}
         />Size
        <select
        value={font}
        onMouseDown={(e)=>{
        changed && e.preventDefault()
        }}
        onChange={(e)=>{
            e.target.style.height = '28px'
            e.target.size = 1
            isChanged(true)
            changeFont(e)}}
        style={{ appearance:'none', textAlign:'center', width:'100%', marginTop:'25%', height:'25px'}}
        onMouseOver={(e:any)=>{
            if(!changed){
                e.target.style.height = '100px'
                e.target.size=fontArray.length
            }
            }} onMouseLeave={(e:any)=>{
                isChanged(false)
                e.target.style.height = '28px'
                e.target.size = 1}}
                onBlur ={() => {isChanged(false)}}

        >
            {
                fontArray.map((f,i)=>{
                    return(
                        <option style={{margin:'0px',maxHeight:'28px'}} 
                        onMouseOver={(e:any)=>{
                        e.target.style.backgroundColor='lightgrey'}}
                        onMouseOut={(e:any)=>{e.target.style.backgroundColor='white'}}
                        key={f} value={f}>{f}</option>
                    );
                })
            }
        </select>
        </>
       
    );
}