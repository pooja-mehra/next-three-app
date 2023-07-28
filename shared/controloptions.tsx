import { useControls } from 'leva'
import { useMemo } from 'react'

export default function ControOptions(props:any){
    const {element} = props
    const options = {
          x: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
          y: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
          z: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
          visible: true,
          color: { value: 'lime' },
          wireframe:false,
        }
    
      return  options
}