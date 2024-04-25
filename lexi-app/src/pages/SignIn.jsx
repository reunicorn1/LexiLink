import { Box, Image, useBreakpointValue, Heading, Text, FormControl, FormLabel, Input, Button, Checkbox, Flex, Spacer } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { useState } from "react";

export default function SignIn () {
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const [formError, setFormError] = useState(false);

    const responseMessage = (response) => {
        console.log(response);
    };

    const handleClick = () => {
        (async ()=> {
            try {
                const result = await axios.post("")
            }
        })();
    }

    return <>
     <Box display="flex" bg="white" h="600px" m={{ base: "60px", xl: "100px" }} mt="10px" rounded="3xl" boxShadow='md'>
     {!isSmallScreen && 
            <Box pos="relative">
                <Image src="/img/bad-school-1.png" alt="hands with text" boxSize='600px' objectFit="cover" roundedLeft="3xl"></Image>
                <Box pos="absolute" width="120px" height="auto" top="10%" left={{ base: '28%', lg: '23%' }} transform="translate(-80%, -50%)">
                <Link to="/"><Image src="/img/logo-2.png" /></Link>
                </Box>
            </Box>
        }
        <Box w={{ base: "100%", md: "70%", lg:"50%" }}>
        {isSmallScreen && 
            <Flex m="50px" mb="0px" justify="flex">
                <Link to="/"><Image src="/img/logo.png" width="100px" height="auto"/></Link>
            </Flex>
        }
            <Box m="50px" mt={{base:"40px", lg: "70px"}} mb="0px">
            <Text mb={2}>Welcome back! </Text>
                <Heading mb={2}>Log in to your Account</Heading>
                <Text>New User? &nbsp;
                    <Link to="/sign-up"><span>Sign Up.</span></Link>
                </Text>
                <Box w="85%" mt="20px">
                    <GoogleLogin onSuccess={responseMessage} onError={()=>{console.log('Login Failed')}} />
                </Box>  
            </Box>
            <form onSubmit={(e) => e.preventDefault()}> {}
                <FormControl mb={3} isInvalid={formError}>
                    <FormLabel>Email Address</FormLabel>
                    <Input placeholder='Enter your email address' w="85%" name="email" />
                    </FormControl>
                    <FormControl isInvalid={formError}>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" placeholder='Enter your password' w="85%" name="password"/>
                    </FormControl>
                    <Flex w="85%" mt={4} alignItems="center">
                        <Checkbox colorScheme="facebook">Remember me?</Checkbox>
                        <Spacer />
                        <Text><Link to="/">Forgot Password?</Link></Text>
                    </Flex>
                    
                    <Button colorScheme="facebook" type="submit" h="40px" w="85%" mt={4}>Sign In</Button>

                </form>
        </Box>
     </Box>
    </>
}