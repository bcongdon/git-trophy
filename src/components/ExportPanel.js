import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Button, Form, Divider, Grid, Input, Popup } from 'semantic-ui-react'

export default class ExportPanel extends React.Component {
  static propTypes = {
    onDownloadClick: PropTypes.func.isRequired,
    loadingDownload: PropTypes.bool,
    loadingExport: PropTypes.bool,
    onExportClick: PropTypes.func.isRequired,
    entity: PropTypes.string,
    year: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.state = {
      showCopyPopup: false
    }

    this.onCopyClick = this.onCopyClick.bind(this)
    this.onTweetClick = this.onTweetClick.bind(this)
  }

  getURL () {
    return `${window.location.origin}?entity=${this.props.entity}&year=${this.props.year}`
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

  onCopyClick () {
    this.copyInput.inputRef.select()
    document.execCommand('copy')
    this.setState({showCopyPopup: true})
    setTimeout(() => {
      this.setState({showCopyPopup: false})
    }, 1000)
  }

  onTweetClick () {
    let twitterURL = 'https://twitter.com/share'
    twitterURL += `?url=${this.getURL()}`
    twitterURL += '&text=' + encodeURIComponent(
      'Check out this 3D model of my github contributions!'
    )
    window.open(twitterURL, '_blank')
  }

  render () {
    const copyButton = (
      <Button
        size='mini'
        content='Copy'
        onClick={this.onCopyClick}
        style={{marginRight: '0.5rem'}} />
    )

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
        <Divider section fitted style={{marginTop: '1rem', marginBottom: '0.75rem'}} />
        <Form size='small'>
          <Form.Group>
            <Input
              value={this.getURL()}
              style={{paddingRight: '0.5rem', paddingLeft: '0.5rem'}}
              className='copy-text-input'
              ref={(el) => { this.copyInput = el }} />
            <Popup
              inverted
              open={this.state.showCopyPopup}
              trigger={copyButton}
              content='Copied!' />
            <Button
              primary
              icon='twitter'
              onClick={this.onTweetClick} />
          </Form.Group>
        </Form>
      </Segment>
    )
  }
}
