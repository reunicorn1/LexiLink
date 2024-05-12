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
import { useWithRefresh } from '../utils/useWithRefresh';
import { API_URL } from '../utils/config';

export default function MenuDisplay({ children }) {
    const navigate = useNavigate();
    const { authToken, refresh, logout } = useAuth();
    const toast = useToast();
    const [executor, { isLoading, isSuccess, isRefreshing }] = useWithRefresh({ isImmediate: false });

    const handleToast = async () => {
        console.log("toast is here!!")
        // add a promise rejection handler
        try {
            toast({
                title: "You've been logged out successfully.",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error(error);
        }
    }

    const followup = () => {
        logout();
        navigate('/')
        handleToast();
    }


    const handleLogOut = async () => {
            await executor(
            (token) => axios.delete(`${API_URL}/auth/logout`, { headers: { Authorization: "Bearer " + token } }),
            (_) => followup()
        )
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