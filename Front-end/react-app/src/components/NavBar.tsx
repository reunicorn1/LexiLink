import { Spacer, Box, Button, Image, useBreakpointValue } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'

export default function NavBar () {
    const location = useLocation().pathname;
    const isSmallScreen = useBreakpointValue({ base: true, md: false });

    return (
            <Box display="flex" as="nav" alignItems="center" m="30px" p="30px" h="40px" bg="white"  rounded="full" boxShadow='base'>
            <Box>
                <Link to='/'><Image src="/img/logo.png" alt="Logo" boxSize="auto" width="100px" height="auto"/></Link>
            </Box>
            <Spacer></Spacer>
            {isSmallScreen ? null : <>
                    <Link to='/'><Button colorScheme='gray' color={location === '/' ? 'brand.700' : 'black'} variant='ghost'>Home</Button></Link>
                    <Link to='/browse'><Button colorScheme='gray' color={location === '/browse' ? 'brand.700' : 'black'} variant='ghost'>Browse a Tutor</Button></Link>
                    <Link to='join-us'><Button colorScheme='gray' color={location === '/join-us' ? 'brand.700' : 'black'} variant='ghost'>Join Us</Button></Link> 
                </>}
            <Link to='/sign-in'><Button colorScheme='facebook' variant='outline' ml="10px">Login</Button></Link>
            <Link to='/sign-up' ><Button colorScheme='facebook' ml="10px" variant='solid'>Sign up</Button></Link>
        </Box>
    );
};