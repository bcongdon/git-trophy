import React from 'react'
import PropTypes from 'prop-types'
import React3 from 'react-three-renderer'
import TrophyModel from './TrophyModel'
import * as THREE from 'three'

const OrbitControls = require('three-orbit-controls')(require('three'))

export default class Preview extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      cameraPosition: new THREE.Vector3(1, 2, 5)
    }
  }

  componentDidMount () {
    const controls = new OrbitControls(this.refs.camera, this.refs.container)
    controls.minDistance = 4
    controls.maxDistance = 25
    controls.enablePan = false
    this.controls = controls

    // Lock light position to camera position
    this.refs.light.position.copy(this.refs.camera.position)
    this.controls.addEventListener('change', () => {
      this.refs.light.position.copy(this.refs.camera.position)
    })
  }

  componentWillUnmount () {
    this.controls.dispose()
    delete this.controls
  }

  render () {
    const { width, height } = this.props
    const aspectratio = width / height

    var cameraprops = {
      fov: 75,
      aspect: aspectratio,
      near: 0.001,
      far: 1000,
      position: this.state.cameraPosition,
      lookAt: new THREE.Vector3(0, 0, 0)
    }

    const data = []
    for (var i = 0; i < 368; i++) {
      data.push({count: Math.random(), level: Math.floor(Math.random() * 5)})
    }

    return (
      <div style={{cursor: 'move'}} ref='container'>
        <React3 onAnimate={this.onAnimate} antialias mainCamera='maincamera' width={width} height={height} clearColor={0xffffff}>
          <scene>

            <perspectiveCamera ref='camera' name='maincamera' {...cameraprops} />

            <directionalLight
              color={0xffffff}
              intensity={0.7}
              castShadow
              ref='light' />

            <ambientLight color={0xffffff} intensity={0.7} />

            <TrophyModel
              data={data}
              username={'bcongdon'}
              year={2016} />

          </scene>
        </React3>
      </div>
    )
  }
}
