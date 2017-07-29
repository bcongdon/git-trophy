import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Header, Loader } from 'semantic-ui-react'
import ContainerDimensions from 'react-container-dimensions'
import Preview from '../components/Preview'
import { connect } from 'react-redux'
import { setSceneContainer } from '../actions'

export class PreviewContainer extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    entity: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    loadingContributions: PropTypes.bool
  }

  render () {
    const loader = (
      <Loader
        active={this.props.loadingContributions}
        size='small'
        inline />
    )

    return (
      <Segment>
        <Header style={{height: 26}}>Preview &nbsp;{loader}</Header>
        <ContainerDimensions ref='container'>
          {({width, height}) => (
            <Preview
              data={this.props.data}
              entity={this.props.entity}
              year={this.props.year}
              width={width - 25}
              height={500}
              ref='preview' />
          )}
        </ContainerDimensions>
      </Segment>
    )
  }

  componentDidMount () {
    this.updateScene()
  }

  componentDidUpdate () {
    this.updateScene()
  }

  updateScene () {
    try {
      this.props.setSceneContainer(this.refs.container)
    } catch (ex) {
      console.log(ex)
    }
  }
}

function mapStateToProps (state) {
  return {
    data: state.data,
    entity: state.previewEntity,
    year: state.previewYear,
    loadingContributions: state.loadingContributions
  }
}

export default connect(mapStateToProps, {setSceneContainer})(PreviewContainer)
