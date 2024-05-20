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
import useAxiosPrivate from "../utils/useAxiosPrivate";

export default function MenuDisplay({ children, isLoading, setIsLoading }) {
    const executor = useAxiosPrivate(isLoading, setIsLoading);
    const navigate = useNavigate();
    const { authToken, refreshToken, refresh, logout, role } = useAuth();
    const toast = useToast();

    const handleToast = async () => {
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
        try {
            const response = await executor.delete(`/auth/logout`, {data: {refresh_token: refreshToken}});
            followup()
        } catch (err) {
            console.error(err);
        }
    }


    return <Menu>
        <MenuButton>
            {children}
        </MenuButton>
        <Portal>
            <MenuList>
                <Link to={role === "student" ? "/profile" : "/mentor/profile"}><MenuItem>Profile</MenuItem></Link>
                <MenuItem>Invite a friend</MenuItem>
                <MenuDivider />
                <MenuItem color="red" onClick={handleLogOut}>Log Out</MenuItem>
            </MenuList>
        </Portal>
    </Menu>
}