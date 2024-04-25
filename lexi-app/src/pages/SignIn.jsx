import { Box, Image, useBreakpointValue, Heading, Text, FormControl, FormLabel, Input, Button, Checkbox } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function SignIn () {
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const [formError, setFormError] = useState({email: false, password: false});

    return <>
     <Box display="flex" bg="white" h="600px" m={{ base: "60px", xl: "100px" }} rounded="3xl" boxShadow='md'>
     {!isSmallScreen && 
            <Box pos="relative">
                <Image src="/img/bad-school-1.png" alt="hands with text" boxSize='600px' objectFit="cover" roundedLeft="3xl"></Image>
                <Box pos="absolute" width="110px" height="auto" top="10%" left={{ base: '28%', lg: '23%' }} transform="translate(-80%, -50%)">
                <Link to="/"><Image src="/img/logo.png" /></Link>
                </Box>
            </Box>
        }
        <Box w={{ base: "100%", md: "70%", lg:"50%" }}>
            <Box m="50px" mb="0px">
            <Text mt="80px" mb={2}>Welcome back! </Text>
                <Heading mb={2}>Log in to your Account</Heading>
                <Text>New User? &nbsp;
                    <Link to="/sign-up"><span>Sign Up.</span></Link>
                </Text>
            </Box>
            <form onSubmit={(e) => e.preventDefault()}> {}
                <FormControl mb={3}>
                    <FormLabel>Email Address</FormLabel>
                    <Input placeholder='Enter your email address' w="85%" name="email" />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" placeholder='Enter your password' w="85%" name="password"/>
                    </FormControl>
                    <Checkbox colorScheme="facebook" mt={5}>Remember me?</Checkbox>
                    <Button colorScheme="facebook" type="submit" h="40px" w="85%" mt={5}>Sign In</Button>
                    <Text mt={2}><Link to="/">Forgot Password?</Link></Text>
                </form>
        </Box>
     </Box>
    </>
}