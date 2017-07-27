import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Header } from 'semantic-ui-react'
import ContainerDimensions from 'react-container-dimensions'
import Preview from '../components/Preview'
import { connect } from 'react-redux'

export class PreviewContainer extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    entity: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired
  }

  render () {
    return (
      <Segment>
        <Header>Preview</Header>
        <ContainerDimensions>
          {({width, height}) => (
            <Preview
              data={this.props.data}
              entity={this.props.entity}
              year={this.props.year}
              width={width - 25}
              height={500} />
          )}
        </ContainerDimensions>
      </Segment>
    )
  }
}

function mapStateToProps (state) {
  return {
    data: state.data,
    entity: state.previewEntity,
    year: state.previewYear
  }
}

export default connect(mapStateToProps)(PreviewContainer)
