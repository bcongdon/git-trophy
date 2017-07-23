import React from 'react'

export function threeMeshToReactMesh (meshObj) {
  return (
    <mesh key={meshObj.uuid} rotation={meshObj.rotation}>
      <geometry
        faces={meshObj.geometry.faces}
        vertices={meshObj.geometry.vertices} />
      <meshStandardMaterial
        color={meshObj.material.color}
        emissive={meshObj.material.emissive}
        emissiveIntensity={meshObj.material.emissiveIntensity}
        roughness={meshObj.material.roughness}
        shading={meshObj.material.shading}
        side={meshObj.material.side} />
    </mesh>
  )
}
