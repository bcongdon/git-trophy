import React from 'react'
import { Segment, Button } from 'semantic-ui-react'

export default class ExportPanel extends React.Component {
  render () {
    return (
      <Segment attached='bottom'>
        <Button.Group size='large' fluid>
          <Button icon='download' content='Download' />
          <Button.Or />
          <Button content='To Shapeways' primary />
        </Button.Group>
      </Segment>
    )
  }
}
