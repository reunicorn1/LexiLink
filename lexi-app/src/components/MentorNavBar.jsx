import { Spacer, Box, Button, Image, useBreakpointValue, Avatar } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext';
import axios from "axios";
import { useEffect, useState } from 'react';
import MenuDisplay from './Menu';
import MenuButtonN from './MenuButton';
import { API_URL } from '../utils/config';

export default function MentorNavBar() {
    const location = useLocation().pathname;
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const { authToken, refresh, setUser } = useAuth();
    const [profilePic, setProfilePic] = useState("");


    const followup = (result) => {
        setUser(result.data);
        setProfilePic(result.data.profile_picture);
    }
    // This is marked as unhandled promise
    useEffect(() => {
        if (authToken) {
            const getProfile = async () => {
                try {
                    const result = await axios.get(`${API_URL}/student/profile`, { headers: { Authorization: "Bearer " + authToken } });
                    followup(result);
                } catch (error) {
                    if (error.response && error.response.status === 410) {
                        refresh()
                        .then(
                            data => {
                                axios.get(`${API_URL}/student/profile`, { headers: { Authorization: "Bearer " + data } })
                                .then(data => followup(data))
                                .then(_ => console.log('--------refresh session successfully from NavBar----->'))
                                .catch(err => console.log({err}))
                            }
                        ).catch();
                    }
                    console.error("An error occurred:", error.response.data);
                }
            };
            getProfile();
        }
    }, []);


    return (
        <Box display="flex" as="nav" alignItems="center" m="30px" p="30px" h="40px" bg="white" rounded="2xl" boxShadow='base'>
            <Box>
                <Link to='/'><Image src="/img/logo-2.png" alt="Logo" boxSize="auto" width="100px" height="auto" /></Link>
            </Box>
            <Spacer></Spacer>

                <Box>
                    <Link to='/mentor/sign-in'><Button size="sm" colorScheme='facebook' variant='outline' ml="10px">Login</Button></Link>
                    <Link to='/mentor/sign-up' ><Button size="sm" colorScheme='facebook' ml="10px" variant='solid'>Sign up</Button></Link>
                </Box>
        </Box>
    );
};