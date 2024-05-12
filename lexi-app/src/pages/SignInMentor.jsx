import { Box, Image, useBreakpointValue, Heading, Text, FormControl, FormLabel, Input, Button, Flex, FormErrorMessage, useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { useState } from "react";
import { useAuth } from '../AuthContext';

export default function SignInMentor () {
    const { authToken, login, setRole } = useAuth();
    const isSmallScreen = useBreakpointValue({ base: true, lg: false });
    const [input, setInput] = useState({ email: "", password: "", user_type: "mentor"});
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
                    const result = await axios.post("http://127.0.0.1:5000/auth/login", input)                    
                    console.log(result.data);
                    login(result.data.access_token, result.data.refresh_token);
                    setRole("mentor")
                    setTimeout(() => {
                        navigate("/mentor/dashboard");
                    }, 1000);
                    handleToast()
                } catch (error){ 
                    console.log("hello??!!!!!!");
                    setFormError("Email or Password provided are incorrect") 
                }
                })();
            } else {
                setFormError("Both fields are required")
            }
     }

    return <>
        <Box display="flex"  justifyContent="center">
            <Box display="flex" bg="white" rounded="3xl" boxShadow="xl" maxW="1100px" m="30px" alignItems="center">
                {!isSmallScreen && <Image src="/img/teacher.png" h="auto" w="50%" roundedLeft="3xl" objectFit="cover"/>}
                <Box w={{lg:"50%"}}>
                    <Box m="50px" mb="0px">
                        <Link to="/"><Image src="/img/logo.png" mt="40px" mb="20px" width="100px" height="auto"/></Link>
                        <Heading mb={2}>Mentor Login</Heading>
                        <Text>New User? &nbsp;
                            <Link to="/mentor/sign-up"><span className="underline"><b>Sign Up.</b></span></Link>
                        </Text>
                        <Box w="85%" mt="20px">
                            <GoogleLogin buttonText="Sign in with Google" onSuccess={responseMessage} onError={()=>{console.log('Login Failed')}} />
                        </Box>
                    </Box> 
                    <Box m="50px" mt="20px">
                    <FormControl mb={3} isInvalid={formError}>
                        <FormLabel>Email Address</FormLabel>
                        <Input placeholder='Enter your email address' w="90%" name="email" value={input.email} onChange={handleInputChange}/>
                        </FormControl>
                        <FormControl isInvalid={formError}>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" placeholder='Enter your password' w="90%" name="password" value={input.password} onChange={handleInputChange}/>
                            <FormErrorMessage>{formError}</FormErrorMessage>
                        </FormControl> 
                        <Button colorScheme="facebook" type="submit" h="40px" w="90%" mt={6} onClick={handleClick}>Sign In</Button>
                        <Flex w="85%" mt={4} justifyContent="center">
                            <Text><Link to="/">Forgot Password?</Link></Text>
                        </Flex>
                    </Box>
                </Box>
            </Box>
        </Box>
    </>
}