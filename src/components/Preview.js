import React from 'react'
import React3 from 'react-three-renderer'
import TrophyModel from './TrophyModel'
import * as THREE from 'three'

const OrbitControls = require('three-orbit-controls')(require('three'))


export default class Preview extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      cameraPosition: new THREE.Vector3(1, 3, 10)
    }
  }

  componentDidMount() {
    const controls = new OrbitControls(this.refs.camera);
    controls.minDistance = 9
    controls.maxDistance = 25
    controls.enablePan = false
    this.controls = controls;

    this.refs.light.position.copy(this.refs.camera.position)
    this.controls.addEventListener('change', () => {
      this.refs.light.position.copy(this.refs.camera.position)
    })
  }

  componentWillUnmount() {
    this.controls.dispose();
    delete this.controls;
  }

  render() {
    const { width, height } = this.props
    const aspectratio = width / height;

    var cameraprops = {
      fov: 75,
      aspect: aspectratio,
      near: 0.001,
      far: 1000,
      position: this.state.cameraPosition, //new THREE.Vector3(1, 3, 10),
      lookAt: new THREE.Vector3(0,0,0)
    }
    return (
      <div style={{cursor: 'move'}}>
        <React3 onAnimate={this.onAnimate} antialias mainCamera="maincamera" width={width} height={height} clearColor={0xffffff}>
          <scene>
            <perspectiveCamera ref="camera" name="maincamera" {...cameraprops} />
            <directionalLight
              color={0xffffff}
              intensity={0.6}
              castShadow
              ref="light"/>

            <ambientLight color={0xffffff} intensity={0.6} />

            <TrophyModel />
          </scene>
        </React3>
      </div>
    )
  }
}
