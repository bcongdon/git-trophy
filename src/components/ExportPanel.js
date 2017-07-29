import React from 'react'
import { Segment, Button } from 'semantic-ui-react'

export default class ExportPanel extends React.Component {
  render () {
    return (
      <Segment attached='bottom'>
        <Button.Group size='large' fluid>
          <Button
            icon='download'
            content='Download'
            onClick={this.props.onDownloadClick}
            loading={this.props.loadingDownload} />
          <Button.Or />
          <Button
            icon='share'
            content='Shapeways'
            primary
            onClick={this.props.onExportClick} />
        </Button.Group>
      </Segment>
    )
  }
}
