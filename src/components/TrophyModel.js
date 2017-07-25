import React from 'react'
import { threeMeshToReactMesh } from '../utils'
import * as THREE from 'three'
import exportX3DScene from '../x3d-exporter'
import X3DLoader from 'three-x3d-loader'
X3DLoader(THREE)

const BASE_COLOR = 0xdedede
const FONT_COLOR = 0x24292e
const BAR_COLORS = [
  0xeeeeee,
  0xc6e48b,
  0x7bc96f,
  0x239a3b,
  0x195127
]

class TrophyModel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      meshes: null
    }
  }

  getBase (numWeeks) {
    const width = numWeeks / 7
    return (
      <mesh position={new THREE.Vector3(-width/2, -3/14, -3/7)}>
        <boxGeometry
          width={width}
          height={.5}
          depth={1}/>
        <meshStandardMaterial
          color={BASE_COLOR}
          roughness={1}
          shading={THREE.FlatShading}/>
      </mesh>
    )
  }

  getLabel () {
    return (
      <mesh>
        <textGeometry
          text='bcongdon / 2016'
          size={32} />
      </mesh>
    )
  }

  getBars () {
    const data = []
    for(var i = 0; i < 365; i++) {
      data.push(Math.random())
    }

    const x0 = -1/7, z0 = -6/7
    return data.map((day, idx) => {

      const week = Math.floor(idx / 7)
      const dayOfWeek = idx % 7
      const pos = new THREE.Vector3(
        x0 - week * 1/7,
        (.5) * day,
        z0 + dayOfWeek * 1/7,
      )

      return (
        <mesh key={idx} position={pos}>
          <boxGeometry
            width={1/7}
            height={day}
            depth={1/7}/>
          <meshStandardMaterial
            color={new THREE.Color(BAR_COLORS[1])}
            roughness={1}
            shading={THREE.FlatShading}/>
        </mesh>
      )
    })
  }

  componentWillMount () {
    

    // const loader = new THREE.X3DLoader()
    // loader.load('model.x3d', (scene) => {
    //   const meshes = []
    //   let scale = new THREE.Vector3()
    //   let quaternion = new THREE.Quaternion()

    //   scene.traverse(function (object) {
    //     if (object instanceof THREE.Mesh) {
    //       const oldMaterial = object.material
    //       object.material = new THREE.MeshStandardMaterial()
    //       object.material.color = oldMaterial.color
    //       object.material.roughness = 1
    //       object.material.metalness = 0
    //       object.material.side = THREE.BackSide
    //       object.geometry.computeFlatVertexNormals()
    //       meshes.push(threeMeshToReactMesh(object))
    //     } else if (object instanceof THREE.Object3D && object.name === 'Cube_TRANSFORM') {
    //       scale = object.scale
    //       quaternion = object.quaternion
    //     }
    //   })
    //   this.setState({meshes, scale, quaternion})
    // })
  }

  render () {
    const { meshes, scale, quaternion } = this.state
    return (
      <object3D scale={scale} quaternion={quaternion}>
        {this.getBase(52)}
        {this.getBars()}
      </object3D>
    )
  }
}

export default TrophyModel
