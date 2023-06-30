
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Link from 'next/link';
import Image from 'next/image';
import { Canvas, useThree, useFrame, MeshProps } from '@react-three/fiber'
import { useState, useRef, useEffect, useMemo, Suspense } from 'react'
import PreviewBox from './previewBox';
import PreviewSphere from './previewSphere';
import PreviewCylinder from './previewCylinder';
import PreviewTorus from './previewTorus'
import PreviewCone from './previewCone';
import { SpotLight } from 'three';
import NewCanvas from '@/pages/newCanvas';
import Carousel from 'react-material-ui-carousel'


export default function MultiList(props:any){
  const [background,setBackground] = useState({toggle:false,index:-1})
  const ImageListArray = [{text:'Create New',url:'./newCanvas'}, {text:'Coming Soon 1',url:'/'}, {text:'Coming Soon 2', url:'/'}, {text:'Coming Soon3', url:'/'}, 
  {text:'Coming Soon 4', url:'/'}]
  const imageListRef = useRef<any>();
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    const handleScroll = (e:any) => {
      const { scrollLeft, clientWidth, scrollWidth } = imageListRef.current;
      if(scrollLeft + clientWidth === scrollWidth && e.clientX >= clientWidth - 10){
        setActiveIndex(0)
        imageListRef.current.scrollLeft = 0
      } else if( scrollLeft === 0 && e.clientX <= 10){
        setActiveIndex(ImageListArray.length -1)
        imageListRef.current.scrollLeft = clientWidth + scrollWidth
      }
    };

    imageListRef.current.addEventListener('mousemove', handleScroll);

  }, [ImageListArray.length]);

  
  return(
    <ImageList
      style={{ display: 'flex',
       flexDirection:'row', flexWrap: 'nowrap',overflowY:'hidden'
       }}
      sx={{
        //width: '100%',
        height:'100%',
        flexWrap: 'nowrap',
        // Promote the list into its own layer in Chrome. This costs memory, but helps keeping high FPS.
        transform: 'translateZ(0)',
        }}
      //rowHeight={250}
      gap={1}
      ref={imageListRef}
      >
        {
          ImageListArray.map((e:any,index:number)=>(
           
            <ImageListItem  cols={0} rows={0} 
              key={index} onPointerOver={(e:any)=> setBackground({toggle:true,index:index})}
              onPointerOut = {(e:any)=> {setBackground({toggle:false,index:index})
              }}
              >
              <Link href={e.url} 
               >
                  <Canvas  camera={{ position: [0,0,1] }} style={{backgroundColor:'white',opacity:0.8}}
                  >
                    <PreviewBox position={[0, 0, 0]} text={e.text} scale={[2,2,1]} font={0.1} isMultiList={true}/>
                  </Canvas>
                  </Link>
                  <ImageListItemBar
                    sx={{
                      background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                      color:'white',
                      zIndex:1,
                      height:'50px',
                    }}
                    title={background.toggle && index == background.index?"Click Me!":e.text}
                    position={"below"}
                    
                  />
                </ImageListItem>

          ))
          }
    </ImageList>  
  );
}