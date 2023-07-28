
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Link from 'next/link';
import Image from 'next/image';
import { Canvas, useThree, useFrame, MeshProps,useLoader } from '@react-three/fiber'
import { useState, useRef, useEffect, useMemo, Suspense } from 'react'
import PreviewBox from './previewBox';
import {
  Text,
  MeshTransmissionMaterial,
  MeshDistortMaterial,
  Html,
  Stats,
  OrbitControls
} from '@react-three/drei'
import BounceLoader from "react-spinners/BounceLoader";

export default function MultiList(props:any){
  const [background,setBackground] = useState({toggle:false,index:-1})
  const ImageListArray = [{text:'+',url:'./newCanvas'}]
  const imageListRef = useRef<any>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading,setIsLoading] = useState({toggle:false,index:-1});

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

  const loadingAnimation = (toggle:boolean,index:number) =>{
    setIsLoading({toggle:toggle,index:index})
  }

  return(
      <ImageList
      style={{ display: 'flex',
       flexDirection:'row', flexWrap: 'nowrap',overflowY:'hidden'
       }}
      sx={{
        width: '100%',
        height:'100%',
        flexWrap: 'nowrap'
        }}
      gap={1}
      ref={imageListRef}
      >
        {
          ImageListArray.map((e:any,index:number)=>(
            <ImageListItem  cols={0} rows={0}
              key={index} onPointerOver={(e)=> {
                setBackground({toggle:true,index:index})
                props.hoverAnimation(true)}}
                onPointerOut = {(e)=> {
                  setBackground({toggle:false,index:index})
                  props.hoverAnimation(false)
              }}>
              <Link href={e.url} onClick={()=>loadingAnimation(true,index)}>
                {
                   isLoading.toggle && isLoading.index == index?
                   <div style={{marginLeft:'90px',height:'150px', width:'200px',textAlign:'center'}}>
                    <BounceLoader
                      color="#36d7b7"
                      size={100}
                    />
                    </div> :
                   <Canvas  camera={{ position: [0,0,2] }} style={{opacity:0.8}}>
                    <ambientLight intensity={1} />
                    <pointLight intensity={1} position={[1, 1, 1]} />
                    <PreviewBox position={[0, 0, 0]} text={e.text} scale={[2,2,2]} font={0.1} isMultiList={true}/>
                  </Canvas>
                }
                  </Link>
                  <ImageListItemBar
                    title={e.text}
                    position={"bottom"}
                  />
                </ImageListItem>
          ))
          }
    </ImageList>  
  );
}