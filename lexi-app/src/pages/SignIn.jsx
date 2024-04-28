import { Box, Image, useBreakpointValue, Heading, Text, FormControl, FormLabel, Input, Button, Checkbox, Flex, Spacer, FormErrorMessage, useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { useState } from "react";
import { useAuth } from '../AuthContext';

export default function SignIn () {
    const { authToken, login, logout } = useAuth();
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const [input, setInput] = useState({ email: "", password: "", user_type: "student"});
    const [formError, setFormError] = useState("");
    const navigate = useNavigate();
    const toast = useToast();

    const responseMessage = (response) => {
        console.log(response);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.currentTarget;
        setInput({ ...input, [name]: value });
        setFormError(false)
    }

    const handleToast = async() => {
        // add a promise rejection handler
        await toast({
            title: "You've been logged in successfully.",
            status: 'success',
            duration: 3000,
            isClosable: true,
          })();
    }

    const handleClick = () => {
        if (Object.values(input).every(value => value)) {
            (async ()=> {
                try {
                    const result = await axios.post("http://127.0.0.1:5000/auth/login", input);
                    console.log(result.data);
                    login(result.data.access_token, result.data.refresh_token);
                    setTimeout(() => {
                        navigate("/");
                    }, 1000);
                    handleToast();

                } catch (error){ setFormError("Email or Password provided are incorrect") }
            })();
        } else {
            setFormError("Both fields are required")
        }
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
                    <GoogleLogin buttonText="Sign in with Google" onSuccess={responseMessage} onError={()=>{console.log('Login Failed')}} />
                </Box>  
            </Box>
            <form onSubmit={(e) => e.preventDefault()}> {}
                <FormControl mb={3} isInvalid={formError}>
                    <FormLabel>Email Address</FormLabel>
                    <Input placeholder='Enter your email address' w="85%" name="email" value={input.email} onChange={handleInputChange}/>
                    </FormControl>
                    <FormControl isInvalid={formError}>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" placeholder='Enter your password' w="85%" name="password" value={input.password} onChange={handleInputChange}/>
                        <FormErrorMessage>{formError}</FormErrorMessage>
                    </FormControl> 
                    <Button colorScheme="facebook" type="submit" h="40px" w="85%" mt={6} onClick={handleClick}>Sign In</Button>
                    <Flex w="85%" mt={4} justifyContent="center">
                        <Text><Link to="/">Forgot Password?</Link></Text>
                    </Flex>
                </form>
        </Box>
     </Box>
    </>
}
