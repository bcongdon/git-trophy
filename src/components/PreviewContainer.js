import React from 'react'
import { Segment } from 'semantic-ui-react'
import ContainerDimensions from 'react-container-dimensions'
import Preview from './Preview'

export default class PreviewContainer extends React.Component {
  render () {
    return (
      <Segment>
        <ContainerDimensions>
          {({width, height}) => (
            <Preview width={width - 25} height={500} />
          )}
        </ContainerDimensions>
      </Segment>
    )
  }
}
