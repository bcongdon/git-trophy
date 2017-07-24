import React from 'react'
import { Segment, Button, Form, Dropdown } from 'semantic-ui-react'

const DEFAULT_GITHUB_ENTITY = 'sindresorhus'

export default class RepoSelector extends React.Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDropdownChange = this.handleDropdownChange.bind(this)

    this.state = {
      githubEntity: DEFAULT_GITHUB_ENTITY,
      yearOptions: [{text: '2017', value: '2017'}],
      selectedYear: '2017'
    }
  }

  handleSubmit (data, foo) {

  }

  handleDropdownChange (e, data) {
    this.setState({selectedYear: data.value})
  }

  render () {
    return (
      <Segment attached='top'>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <Form.Input
              defaultValue={DEFAULT_GITHUB_ENTITY}
              label='Github Username or Repo'
              placeholder='User / Repo Name'/>
          </Form.Field>
          <Form.Field>
            <label>Year</label>
            <Dropdown
              onChange={this.handleDropdownChange}
              fluid
              selection
              options={this.state.yearOptions}
              disabled={!this.state.githubEntity}
              defaultValue='2017' />
          </Form.Field>
          <Button
            type='submit'
            primary
            disabled={!(this.state.githubEntity && this.state.selectedYear)}>
              Generate!
          </Button>
        </Form>
      </Segment>
    )
  }
}
