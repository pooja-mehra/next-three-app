import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Published from '@/pages/published';
export default function Preview(props:any){
    const {canvas, elements, canvasRef, textArray,sequence} = props
    const [test,setTest] = useState<any>(null)
    const [test1,set1] = useState<any>(null)
    const startRecording = (function (){
      if(canvasRef.current){
      let stream =canvasRef.current.captureStream() 
      const video:any = document.querySelector('video');
      const chunks:any = []; 
      let url:any
      const rec = new MediaRecorder(stream, { mimeType: 'video/webm' })

      rec.addEventListener('dataavailable', e => {
        url = URL.createObjectURL(e.data)
        set1(url)
      }
      );
      return { 
        stopRecording() {
        rec.stop()
        video.src = test1 == null ? url : test1 
        //exportVid(new Blob(chunks, {type: 'video/webm'}));
      },
      startRec(){
        rec.start()
      },};
      //
      //}
    }})();

    
    function exportVid(blob:any) {
      const vid = document.createElement('video');
      vid.src = URL.createObjectURL(blob);
      vid.controls = true;
      document.body.appendChild(vid);
      const a = document.createElement('a');
      a.download = 'myvid.webm';
      a.href = vid.src;
      a.textContent = 'download the video';
      document.body.appendChild(a);
    }

    return (
        <div style={{textAlign:'center',height:'400px'}} >
            <div style={{height:'10%', marginTop :'2%'}}>
            <Tooltip title={'Add New'}>
            <IconButton aria-label="add" onClick={props.clearCanvas}>
              <AddIcon />
            </IconButton>
            </Tooltip>
             </div>
            <div style={{height:'20%',border:'solid', opacity :0}} id={'imgdiv'}>
              {
                sequence?<video style={{height:'100%', width:'100%'}} controls></video>
                :<img style={{height:'100%', width:'100%',transform:'scale(1)'}} alt={'test'} src={''} id={'img'}/>

              }
            </div>
        </div>)
}

/*<div style={{height:'10%', marginTop :'2%'}}>
            <IconButton aria-label="start" onClick={async ()=>   
              startRecording && startRecording.startRec()}>
                <StartIcon />
            </IconButton>
             </div>
             <div style={{height:'10%', marginTop :'2%'}}>
            <IconButton aria-label="start" onClick={ () =>  
              startRecording && startRecording.stopRecording()}>
                <StopIcon />
            </IconButton>
             </div>*/
             /*<div style={{height:'20%',border:'solid'}}>
              <video style={{height:'100%', width:'100%'}} controls></video>
            </div>*/
            /*
            <Tooltip title={'Add New'}>
            <IconButton aria-label="add" onClick={props.clearCanvas}>
              <AddIcon />
            </IconButton>
            </Tooltip>*/