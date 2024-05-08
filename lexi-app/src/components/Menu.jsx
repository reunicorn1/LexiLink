import {
    Menu,
    MenuButton,
    MenuList,
    MenuDivider,
    MenuItem,
    Portal,
    useToast
  } from '@chakra-ui/react'
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../AuthContext';


export default function MenuDisplay ({children}) {
    const navigate = useNavigate();
    const { authToken, refresh, logout } = useAuth();
    const toast = useToast();

    const handleToast = async() => {
        console.log("toast is here!!")
        // add a promise rejection handler
        await toast({
            title: "You've been logged out successfully.",
            status: 'success',
            duration: 3000,
            isClosable: true,
          })();
    }

    const followup = () => {
        logout();
        navigate('/')
        handleToast();
    }


    const handleLogOut = async () => {
            try {
                const logOut = await axios.delete("http://127.0.0.1:5000/auth/logout", { headers: {Authorization: "Bearer " + authToken} })

            } catch(error) {
                if (error.response && error.response.status === 410) {
                    refresh()
                    .then(data => {
                        axios.delete("http://127.0.0.1:5000/auth/logout", { headers: {Authorization: "Bearer " + data} })
                        .then(followup())
                        .then(_ => console.log('--------refresh session successfully from Menu during logging out----->'))
                        .catch(err => console.log("an error occured during refreshing the token while logging out", err))
                    }).catch();
                }
                console.log("Error while logging out of your account, try again")
            }
        }
    

    return <Menu>
        <MenuButton>
            {children}
        </MenuButton>
        <Portal>
        <MenuList>
            <Link to="/profile"><MenuItem>Profile</MenuItem></Link>
            <MenuItem>Invite a friend</MenuItem>
            <MenuDivider />
            <MenuItem color="red" onClick={handleLogOut}>Log Out</MenuItem>
        </MenuList>
        </Portal>
    </Menu>
}