import React from 'react';
import React3 from 'react-three-renderer'
import * as THREE from 'three'
import X3DLoader from 'three-x3d-loader'
X3DLoader(THREE)

const OrbitControls = require('three-orbit-controls')(require('three'))

class GreenCube extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      model: null
    }
  }
  
  componentWillMount () {
    const loader = new THREE.X3DLoader()
    loader.load('model.x3d', (obj) => {
      this.setState({model: obj})
      console.log(obj)

      var renderer = new THREE.WebGLRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight );
      var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

      camera.position.set(5, 1, -3)
      camera.lookAt(new THREE.Vector3())

      var controls = new OrbitControls(camera)
      var pointLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
      var ambient = new THREE.AmbientLight( 0xd2d2d2, 0.5);

      pointLight.castShadow = true;


      renderer.setClearColor(0xffffff, 1.0)
      renderer.gammaOutput = true
      camera.add(pointLight)
      obj.add(camera)

      obj.add(ambient)

      camera.addEventListener( 'change', () => {
        pointLight.position.copy(camera.position)
      })

      obj.traverse (function (object)
      {
          console.log(object)
          if (object instanceof THREE.Mesh)
          {
            object.material.emissiveIntensity = 0
            object.material.shininess = 0
            object.material.specular = new THREE.Color(0, 0, 0)
            object.material.shading = THREE.SmoothShading
            const oldMaterial = object.material
            object.material = new THREE.MeshStandardMaterial()
            object.material.color = oldMaterial.color
            object.material.roughness = 1
            object.material.metalness = 0
            object.material.side = THREE.BackSide
            object.geometry.computeFlatVertexNormals()
          }
      });

      function animate() {
        requestAnimationFrame( animate );
        renderer.render( obj, camera );
      }
      document.body.appendChild( renderer.domElement )
      animate()
    })
  }

  render () {
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
