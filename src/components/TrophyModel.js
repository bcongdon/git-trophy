import React from 'react'
import { threeMeshToReactMesh } from '../utils'
import * as THREE from 'three'
import X3DLoader from 'three-x3d-loader'
X3DLoader(THREE)


class TrophyModel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      meshes: null
    }
  }

  componentWillMount () {
    const loader = new THREE.X3DLoader()
    loader.load('model.x3d', (scene) => {
      const meshes = []
      let scale = new THREE.Vector3()
      let quaternion = new THREE.Quaternion()
      scene.traverse (function (object)
      {
        if (object instanceof THREE.Mesh) {
          const oldMaterial = object.material
          object.material = new THREE.MeshStandardMaterial()
          object.material.color = oldMaterial.color
          object.material.roughness = 1
          object.material.metalness = 0
          object.material.side = THREE.BackSide
          object.geometry.computeFlatVertexNormals()
          meshes.push(threeMeshToReactMesh(object))
        }
        else if (object instanceof THREE.Object3D && object.name === 'Cube_TRANSFORM') {
          scale = object.scale
          quaternion = object.quaternion
        }
      })
      this.setState({meshes, scale, quaternion})
    })
  }

  render () {
    const { meshes, scale, quaternion } = this.state
    return (
      <object3D scale={scale} quaternion={quaternion}>
        {meshes}
      </object3D>
    )
  }
}

export default TrophyModel
