import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Button } from 'semantic-ui-react'

export default class ExportPanel extends React.Component {
  static propTypes = {
    onDownloadClick: PropTypes.func.isRequired,
    loadingDownload: PropTypes.bool,
    loadingExport: PropTypes.bool,
    onExportClick: PropTypes.func.isRequired
  }

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
            onClick={this.props.onExportClick}
            loading={this.props.loadingExport} />
        </Button.Group>
      </Segment>
    )
  }
}
