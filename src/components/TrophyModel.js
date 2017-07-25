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

  getBase (numDays) {
    const width = Math.ceil(numDays / 7) / 7
    return (
      <mesh position={new THREE.Vector3((-width/2) - 1/14, 0, -3/7)}>
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
    for(var i = 0; i < 368; i++) {
      data.push({count: Math.random(), level: Math.floor(Math.random() * 5)})
    }

    const x0 = -1/7, z0 = -6/7
    return data.map((day, idx) => {

      const week = Math.floor(idx / 7)
      const dayOfWeek = idx % 7
      const pos = new THREE.Vector3(
        x0 - week * 1/7,
        (.5) * day.count + .25,
        z0 + dayOfWeek * 1/7,
      )

      return (
        <mesh key={idx} position={pos}>
          <boxGeometry
            width={1/7}
            height={day.count}
            depth={1/7}/>
          <meshStandardMaterial
            color={new THREE.Color(BAR_COLORS[day.level])}
            roughness={1}
            shading={THREE.FlatShading}/>
        </mesh>
      )
    })
  }

  render () {
    const { meshes, scale, quaternion } = this.state
    const width = Math.ceil(368 / 7) / 7
    return (
      <object3D position={new THREE.Vector3(width/2 + 1/14, 0, 3/7)}>
        {this.getBase(368)}
        {this.getBars()}
      </object3D>
    )
  }
}

export default TrophyModel
