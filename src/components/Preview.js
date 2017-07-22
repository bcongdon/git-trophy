import React from 'react';
import React3 from 'react-three-renderer'
import * as THREE from 'three'


const OrbitControls = require('three-orbit-controls')(require('three'))

class GreenCube extends React.Component {
  render() {
    return <mesh>
            <boxGeometry width={200} height={200} depth={200} />
            <meshBasicMaterial color={0x00ee00} />
           </mesh>
  }
}


export default class Preview extends React.Component {
  componentDidMount() {
    const controls = new OrbitControls(this.refs.camera);
    controls.minDistance = 400;
    controls.maxDistance = 10000;
    this.controls = controls;
  }

  componentWillUnmount() {
    this.controls.dispose();
    delete this.controls;
  }


  render() {
    const { width, height } = this.props
    const aspectratio = width / height;

    var cameraprops = {
      fov: 90,
      aspect: aspectratio,
      near: 0.1,
      far: 10000,
      position: new THREE.Vector3(300,400,600),
      lookAt: new THREE.Vector3(0,0,0)
    }

    return (
      <React3 mainCamera="maincamera" width={width} height={height} clearColor={0xffffff}>
        <scene>
          <perspectiveCamera ref="camera" name="maincamera" {...cameraprops} />
          <GreenCube />
        </scene>
      </React3>
    )
  }
}
