import React, { useRef } from "react"
import * as THREE from "three"

export default function  Curve(props:any) {
    const ref = useRef<any>()
    var curve = new THREE.EllipseCurve(0, props.y, props.r, props.r, 0, 2 ,false, 3.7)
    const points = curve.getPoints( 20 );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.LineBasicMaterial( { color: 'black' } );

  return (
    <>
      <mesh ref ={ref} geometry={geometry} material={material}/>
    </>
    )
}
