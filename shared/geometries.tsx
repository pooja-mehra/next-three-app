
import * as THREE from 'three';
export default function Geometries(color:string):any[]{
    let box = new THREE.BoxGeometry(0.6,0.6,0.6)
    let cylinder = new THREE.CylinderGeometry(0.4, 0.4, 0.6)
    let sphere = new THREE.SphereGeometry(0.4, 32, 32)
    return(
    [{type:box,color:color,id:box.id,name:box.type}, 
    {type:cylinder,color:color,id:cylinder.id,name:cylinder.type},
    {type:sphere,color:color,id:sphere.id, name:sphere.type}]);
}