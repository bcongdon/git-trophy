import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Button, Form, Divider, Grid, Input } from 'semantic-ui-react'

export default class ExportPanel extends React.Component {
  static propTypes = {
    onDownloadClick: PropTypes.func.isRequired,
    loadingDownload: PropTypes.bool,
    loadingExport: PropTypes.bool,
    onExportClick: PropTypes.func.isRequired
  }

  getButtonGroup (size) {
    return (
      <Button.Group style={{paddingLeft: '1rem', paddingRight: '1rem'}} size={size} fluid>
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
    )
  }

  render () {
    return (
      <Segment attached='bottom'>
        <Grid>
          <Grid.Row only='mobile'>
            {this.getButtonGroup('medium')}
          </Grid.Row>
          <Grid.Row only='tablet computer'>
            {this.getButtonGroup('large')}
          </Grid.Row>
        </Grid>
        <Divider section fitted style={{marginTop: '1rem', marginBottom: '0.75rem'}}/>
        <Form size='small'>
          <Form.Group>
            <Input
              onChange={this.handleEntityChange}
              value={'http://google.com'}
              style={{paddingRight: '1rem', paddingLeft: '0.5rem'}}
              className={'copy-test-input'} />
            <Button size='mini' content='Copy'/>
          </Form.Group>
        </Form>
      </Segment>
    )
  }
}
