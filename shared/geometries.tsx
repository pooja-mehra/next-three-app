
import * as THREE from 'three';
export default function Geometries(color:string):any[]{
    let box = new THREE.BoxGeometry(0.6,0.6,0.6)
    let cylinder = new THREE.CylinderGeometry(0.4, 0.4, 0.6,10)
    let sphere = new THREE.SphereGeometry(0.4, 16, 16)
    let cone = new THREE.ConeGeometry(0.4, 0.8, 10)
    let torus = new THREE.TorusGeometry(0.3, 0.1, 16)
    return(
    [{type:box,color:color,id:box.id,name:box.type}, 
    {type:cylinder,color:color,id:cylinder.id,name:cylinder.type},
    {type:sphere,color:color,id:sphere.id, name:sphere.type},
    {type:cone,color:color,id:cone.id, name:cone.type},
    {type:torus,color:color,id:torus.id, name:torus.type}]);
}