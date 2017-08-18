import React from 'react'
import { Menu } from 'semantic-ui-react'

const Navbar = () => (
  <Menu>
    <Menu.Item href='/'>
      <img
        style={{height: 24, width: 'auto', paddingRight: 8}}
        src='/img/trophy.png'
      />
      Git Trophy
    </Menu.Item>
  </Menu>
)

export default Navbar
