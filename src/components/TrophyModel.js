import React from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'
import droidFont from '../../node_modules/three/examples/fonts/droid/droid_sans_regular.typeface.json'

const BASE_COLOR = 0xdedede
const FONT_COLOR = 0x24292e
const BAR_COLORS = [
  0xeeeeee,
  0xc6e48b,
  0x7bc96f,
  0x239a3b,
  0x195127
]
const ROUGHNESS = 0.8
const MAX_BAR_Z = 0.75
const MIN_BAR_Z = 0.05

class TrophyModel extends React.Component {
  static propTypes = {
    entity: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired
  }

  getBase () {
    const width = Math.ceil(this.props.data.length / 7) / 7
    return (
      <mesh position={new THREE.Vector3((width / 2) - 3 / 14, 0, -3 / 7)}>
        <boxGeometry
          width={width}
          height={0.5}
          depth={1} />
        <meshStandardMaterial
          color={BASE_COLOR}
          roughness={ROUGHNESS}
          shading={THREE.FlatShading} />
      </mesh>
    )
  }

  getLabelText () {
    const truncatedName = (
      this.props.entity.length < 23 ? this.props.entity : this.props.entity.slice(0, 20) + '...'
    )

    const delimiter = this.props.entity.includes('/') ? '-' : '/'
    return `${truncatedName} ${delimiter} ${this.props.year}`
  }

  getLabel () {
    return (
      <mesh position={new THREE.Vector3(0, -0.125, 0)}>
        <textGeometry
          text={this.getLabelText()}
          size={0.33}
          height={0.1}
          font={new THREE.Font(droidFont)} />
        <meshStandardMaterial
          color={FONT_COLOR}
          roughness={ROUGHNESS}
          shading={THREE.FlatShading} />
      </mesh>
    )
  }

  getBars () {
    const x0 = -1 / 7
    const z0 = -6 / 7

    const maxCount = this.props.data.reduce((prev, curr) => {
      return curr.count > prev ? curr.count : prev
    }, 0)

    return this.props.data.map((day, idx) => {
      if (!day.count) {
        return null
      }

      const week = Math.floor(idx / 7)
      const dayOfWeek = idx % 7
      const height = MIN_BAR_Z + ((MAX_BAR_Z - MIN_BAR_Z) * (day.count / maxCount))
      const pos = new THREE.Vector3(
        x0 + week * 1 / 7,
        (0.5) * height + 0.25,
        z0 + dayOfWeek * 1 / 7
      )

      return (
        <mesh key={idx} position={pos}>
          <boxGeometry
            width={1 / 7}
            height={height}
            depth={1 / 7} />
          <meshStandardMaterial
            color={new THREE.Color(BAR_COLORS[day.level])}
            roughness={ROUGHNESS}
            shading={THREE.FlatShading} />
        </mesh>
      )
    })
  }

  render () {
    const width = Math.ceil(this.props.data.length / 7) / 7
    return this.props.data ? (
      <object3D position={new THREE.Vector3(-(width / 2) + 3 / 14, 0, 3 / 7)}>
        {this.getBase()}
        {this.getBars()}
        {this.getLabel()}
      </object3D>
    ) : null
  }
}

export default TrophyModel
