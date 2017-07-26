import React from 'react'
import { Segment, Header } from 'semantic-ui-react'
import ContainerDimensions from 'react-container-dimensions'
import Preview from './Preview'

export default class PreviewContainer extends React.Component {
  render () {
    return (
      <Segment>
        <Header>Preview</Header>
        <ContainerDimensions>
          {({width, height}) => (
            <Preview width={width - 25} height={500} />
          )}
        </ContainerDimensions>
      </Segment>
    )
  }
}
