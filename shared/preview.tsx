import Stack from '@mui/material/Stack'
import { useState, useEffect } from 'react'
import Font from './font';
import { animated, useSpring } from 'react-spring';

export default function Preview(props:any){
    const {canvas, elements} = props
    console.log(elements)
    console.log(canvas)
    return (
        <div style={{textAlign:'center',height:'400px'}}>
            <div style={{height:'20%',border:'solid', backgroundColor:canvas[0].color}}>
            
            </div>
        </div>)
}