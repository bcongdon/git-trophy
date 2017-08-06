import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  downloadModel,
  exportModel,
  loadContributions,
  updateSelectedEntity,
  updateSelectedYear } from '../actions'
import RepoSelector from '../components/RepoSelector'
import ExportPanel from '../components/ExportPanel'

export class RepoSelectorContainer extends React.Component {
  static propTypes = {
    authenticating: PropTypes.bool,
    downloadModel: PropTypes.func.isRequired,
    entity: PropTypes.string.isRequired,
    erroredEntity: PropTypes.bool,
    exportModel: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool,
    loadContributions: PropTypes.func.isRequired,
    loadingDownload: PropTypes.bool,
    loadingExport: PropTypes.bool,
    loadingYears: PropTypes.bool,
    updateSelectedEntity: PropTypes.func.isRequired,
    updateSelectedYear: PropTypes.func.isRequired,
    year: PropTypes.string.isRequired,
    yearOptions: PropTypes.array.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      exportAuthInProgress: false
    }

    this.handleExportClick = this.handleExportClick.bind(this)
  }

  render () {
    const yearOptions = this.props.yearOptions.map((year) => {
      return {value: year, text: year}
    })

    return (
      <div>
        <RepoSelector
          submitRepoChanges={this.props.loadContributions}
          updateSelectedYear={this.props.updateSelectedYear}
          updateSelectedEntity={this.props.updateSelectedEntity}
          entity={this.props.entity}
          year={this.props.year}
          yearOptions={yearOptions}
          loadingYears={this.props.loadingYears}
          erroredEntity={this.props.erroredEntity} />
        <ExportPanel
          onDownloadClick={this.props.downloadModel}
          onExportClick={this.handleExportClick}
          loadingDownload={this.props.loadingDownload}
          loadingExport={this.props.loadingExport || this.props.authenticating}
          year={this.props.year}
          entity={this.props.entity} />
      </div>
    )
  }

  handleExportClick () {
    if (!this.props.isLoggedIn) {
      this.setState({exportAuthInProgress: true})
    }
    this.props.exportModel()
  }

  componentDidUpdate () {
    this.checkAuthCallback()
  }

  componentDidMount () {
    this.checkAuthCallback()
  }

  checkAuthCallback () {
    // Check to see if auth callback has occurred
    if (this.props.isLoggedIn && this.state.exportAuthInProgress && !this.props.loadingExport) {
      this.setState({exportAuthInProgress: false})
      this.props.exportModel()
    }
  }
}

const actions = {
  downloadModel,
  exportModel,
  loadContributions,
  updateSelectedEntity,
  updateSelectedYear
}

function mapStateToProps (state) {
  return {
    authenticating: state.auth.isAuthenticating,
    entity: state.app.entity,
    erroredEntity: state.app.erroredEntity,
    isLoggedIn: state.auth.isLoggedIn,
    loadingDownload: state.app.loadingDownload,
    loadingExport: state.app.loadingExport,
    loadingYears: state.app.loadingYears,
    year: state.app.year,
    yearOptions: state.app.yearOptions
  }
}

export default connect(mapStateToProps, actions)(RepoSelectorContainer)
