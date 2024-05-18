import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  IconButton
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom'

export default function MenuButtonN({isloggedIn}) {

  return <>
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label='Options'
        icon={<HamburgerIcon />}
        variant='outline'
      />
      <MenuList>
      <MenuGroup title='Navigation'>
        <Link to='/'><MenuItem>Home</MenuItem></Link>
        <Link to='/browse'><MenuItem>Browse a Mentor</MenuItem></Link>
        <Link to="/mentor/"><MenuItem>Mentor Portal</MenuItem></Link>
      </MenuGroup>
      <MenuDivider />
      {!isloggedIn &&
      <MenuGroup title='Profile'>
        <Link to='/sign-in'><MenuItem>Login</MenuItem></Link>
        <Link to='/sign-up'><MenuItem>Sign up</MenuItem></Link>
      </MenuGroup>
  }
    </MenuList>
    </Menu>
  
  </>
}