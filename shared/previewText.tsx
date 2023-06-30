import { extend, Object3DNode } from '@react-three/fiber';
import * as React from 'react';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import {
    Text,
    MeshTransmissionMaterial,
    MeshDistortMaterial,
    Html
  } from '@react-three/drei'

export default function TextMesh () {
    const font = new FontLoader().parse( 'three.js-master/examples/fonts/helvetiker_regular.typeface.json')
    /*const Text = () => {
        return new TextGeometry( 'Hello three.js!', {
        font: font,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
    })}*/

    return (
    <Html>
        <div style={{color:'red', marginRight:'-100px'}} onClick={(e)=>console.log(e)}>Test</div>
      </Html>
    );
    
}