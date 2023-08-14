
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

export default function Transition(props:any){
    const {selected, sequence} = props
    
    switch(selected?selected.name:'canvas'){
        case 'canvas':
        return(
            <>
            <FormGroup>
            <FormControlLabel control={<Checkbox />} label="Show In Order" onChange={()=>{
                        props.setSequence(!sequence)}} value={sequence}/>
            <FormControlLabel control={<Checkbox />} label="Rotation" />
            </FormGroup>
            </>)
        case 'element':
            return (
            <>
            <FormGroup>
            <FormControlLabel control={<Checkbox />} label="Scale" />
            </FormGroup>
            </>)
            
        case 'text':
            return (
            <>
            <FormGroup>
            <FormControlLabel control={<Checkbox />} label="Type" />
            </FormGroup>
            </>)
        default:
            return(
                <>
                <div style={{ float: 'left', width: '10%', margin:'1%'}}>
                    Orbit Control
                </div>
                <div style={{ float: 'left', width: '10%', margin:'1%'}}>
                    Texture
                </div>
            </>)
        }
    }
    