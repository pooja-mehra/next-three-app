import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';

export default function CommonMenu(props:any) {
  const {geometry,index} = props
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const cloneElement = (e: any) => {
    let args = Object.values(geometry[index].type.parameters)
    props.cloneElement(args,geometry[index].color,geometry[index].id,geometry[index].name,e)
}
const [newcolor,setNewColor] = useState('')

const setColor = (color:string, index:number, elements:any) =>{
    setNewColor(color)
    elements[index].color = color
}

  return (
    <div>
      <Tooltip title="menu">
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={(e)=>{
            setAnchorEl(null)
            cloneElement(e)
            }}>Clone</MenuItem>
      </Menu>
    </div>
  );
}
//<MenuItem><ColorPallet elements={geometry} index ={index} setColor={props.setColor}/></MenuItem>
