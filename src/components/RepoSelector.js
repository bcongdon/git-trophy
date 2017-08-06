import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Form, Dropdown, Header } from 'semantic-ui-react'

export default class RepoSelector extends React.Component {
  static propTypes = {
    entity: PropTypes.string.isRequired,
    erroredEntity: PropTypes.bool,
    loadingYears: PropTypes.bool,
    updateSelectedEntity: PropTypes.func.isRequired,
    updateSelectedYear: PropTypes.func.isRequired,
    year: PropTypes.string.isRequired,
    yearOptions: PropTypes.array.isRequired
  }

  constructor (props) {
    super(props)
    this.handleDropdownChange = this.handleDropdownChange.bind(this)
    this.handleEntityChange = this.handleEntityChange.bind(this)

    this.state = {
      githubEntity: 'DEFAULT_GITHUB_ENTITY',
      selectedYear: this.props.yearOptions ? this.props.yearOptions[0] : null
    }
  }

  handleDropdownChange (e, data) {
    this.props.updateSelectedYear(data.value)
  }

  handleEntityChange (e, data) {
    this.props.updateSelectedEntity(data.value)
  }

  render () {
    return (
      <Segment attached='top'>
        <Header
          size='large'
          content='Generate a Git Trophy' />
        <Form size='large'>
          <Form.Field>
            <Form.Input
              onChange={this.handleEntityChange}
              value={this.props.entity}
              label='Github Username or Repo'
              placeholder='User / Repo Name'
              error={this.props.erroredEntity} />
          </Form.Field>
          <Form.Field>
            <label>Year</label>
            <Dropdown
              onChange={this.handleDropdownChange}
              fluid
              selection
              options={this.props.yearOptions}
              disabled={!this.props.yearOptions || !this.props.yearOptions.length}
              loading={this.props.loadingYears}
              value={this.props.year} />
          </Form.Field>
        </Form>
      </Segment>
    )
  }
}
