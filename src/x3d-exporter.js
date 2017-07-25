import xmlbuilder from 'xmlbuilder'

function createX3DRoot () {
  return xmlbuilder.create('X3D')
    .att('profile', 'Immersive')
    .att('xmlns:xsd', 'http://www.w3.org/2001/XMLSchema-instance')
    .att('xsd:noNamespaceSchemaLocation', 'http://www.web3d.org/specifications/x3d-3.0.xsd')
}

function exportMaterial (material, tree) {
  tree.ele('Appearance')
    .ele('Material')
    .att('diffuseColor', material.color.toArray().join(' '))
}

function exportGeometry (geometry, tree) {
  tree.ele('IndexedFaceSet')
    .att('solid', true)
    .att('coordIndex', geometry.faces.reduce((arr, v) => {
      return arr.concat([v.a, v.b, v.c, -1])
    }, []).join(' '))
    .ele('Coordinate')
    .att('point', geometry.vertices.reduce((arr, v) => {
      return arr.concat(v.toArray())
    }, []).join(' '))
}

function exportObject (object, tree) {
  if (object.type === 'Mesh' || object.type === 'Object3D') {
    tree = tree.ele('Transform')
      .att('translation', object.position.toArray().join(' '))
      .att('scale', object.scale.toArray().join(' '))
      .att('rotation', object.quaternion.toArray().join(' '))
  }

  if (object.type === 'Mesh') {
    tree = tree.ele('Group').ele('Shape')
    exportMaterial(object.material, tree)
    exportGeometry(object.geometry, tree)
    tree.up().up()
  } else if (object.type === 'Object3D') {
    object.children.forEach((child) => {
      exportObject(child, tree)
    })
  }
  tree.up()
}

function exportSceneX3D (scene) {
  var tree = createX3DRoot()
  tree = tree.ele('Scene')

  scene.children.forEach((child) => {
    exportObject(child, tree)
  })

  return tree.end({pretty: true})
}

export default exportSceneX3D
