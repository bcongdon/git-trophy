import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Form, Dropdown, Header } from 'semantic-ui-react'

export default class RepoSelector extends React.Component {
  static propTypes = {
    yearOptions: PropTypes.array.isRequired,
    entity: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    updateSelectedYear: PropTypes.func.isRequired,
    updateSelectedEntity: PropTypes.func.isRequired,
    loadingYears: PropTypes.bool
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
        <Header>Generate a Git Trophy</Header>
        <Form size='large'>
          <Form.Field>
            <Form.Input
              onChange={this.handleEntityChange}
              value={this.props.entity}
              label='Github Username or Repo'
              placeholder='User / Repo Name' />
          </Form.Field>
          <Form.Field>
            <label>Year</label>
            <Dropdown
              onChange={this.handleDropdownChange}
              fluid
              selection
              options={this.props.yearOptions}
              disabled={!this.props.yearOptions}
              loading={this.props.loadingYears}
              value={this.props.year} />
          </Form.Field>
        </Form>
      </Segment>
    )
  }
}
