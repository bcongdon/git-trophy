import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  loadContributions,
  updateSelectedYear,
  updateSelectedEntity } from '../actions'
import RepoSelector from '../components/RepoSelector'
import ExportPanel from '../components/ExportPanel'

export class RepoSelectorContainer extends React.Component {
  static propTypes = {
    loadContributions: PropTypes.func.isRequired,
    updateSelectedYear: PropTypes.func.isRequired,
    updateSelectedEntity: PropTypes.func.isRequired,
    entity: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired
  }

  render () {
    return (
      <div>
        <RepoSelector
          submitRepoChanges={this.props.loadContributions}
          updateSelectedYear={this.props.updateSelectedYear}
          updateSelectedEntity={this.props.updateSelectedEntity}
          entity={this.props.entity}
          year={this.props.year}
          yearOptions={[{value: '2017', text: '2017'}]} />
        <ExportPanel />
      </div>
    )
  }
}

const actions = {
  loadContributions,
  updateSelectedYear,
  updateSelectedEntity
}

function mapStateToProps (state) {
  return {
    entity: state.entity,
    year: state.year
  }
}

export default connect(mapStateToProps, actions)(RepoSelectorContainer)
