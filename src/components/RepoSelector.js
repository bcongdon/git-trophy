import React from 'react'
import { Segment, Button, Dropdown, Form } from 'semantic-ui-react'

export default class RepoSelector extends React.Component {
  render () {
    return (
      <Segment>
        <Form>
          <Form.Field>
            <label>Github Username or Repo</label>
            <input placeholder='torvolds' />
          </Form.Field>
          <Form.Field>
            <label>Year</label>
            <input placeholder='2017' />
          </Form.Field>
          <Button type='submit' primary>Generate!</Button>
        </Form>
      </Segment>
    )
  }
}
