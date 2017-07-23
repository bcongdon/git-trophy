import React from 'react'
import * as THREE from 'three'

export function threeMeshToReactMesh (mesh_obj) {
  return (
    <mesh key={mesh_obj.uuid} rotation={mesh_obj.rotation}>
      <geometry
        faces={mesh_obj.geometry.faces}
        vertices={mesh_obj.geometry.vertices}/>
      <meshStandardMaterial
        color={mesh_obj.material.color}
        emissive={mesh_obj.material.emissive}
        emissiveIntensity={mesh_obj.material.emissiveIntensity}
        roughness={mesh_obj.material.roughness}
        shading={mesh_obj.material.shading}
        side={mesh_obj.material.side}/>
    </mesh>
  )
}
