import { Box, Image, useBreakpointValue, Heading, Text, FormControl, FormLabel, Input, Button, Checkbox, Flex, Spacer, FormErrorMessage, useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { useState } from "react";
import { useAuth } from '../AuthContext';
import { API_URL } from '../utils/config';
import { useEffect } from "react";


export default function SignIn({ isLoading, setIsLoading }) {
    const { login, setRole, role } = useAuth();
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const [input, setInput] = useState({ email: "", password: "", user_type: "student" });
    const [formError, setFormError] = useState("");
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        if (role) {
            navigate("/");
        }
    }, [])

    // const responseMessage = (response) => {
    //     console.log(response);
    // };

    const loging = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                const res = await axios.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${response.access_token}`,
                        },
                    }
                );
                handleGoogle(res);
            } catch (err) {
                console.log(err);
            }
        }
    });

    const handleGoogle = (response) => {
        (async () => {
            try {
                const result = await axios.post(`${API_URL}/auth/login`, { email: response.data.email, password: response.data.sub, user_type: "student" });
                login(result.data.access_token, result.data.refresh_token);
                setRole("student")
                setTimeout(() => {
                    navigate("/");
                }, 1000);
                handleToast()
            } catch (error) {
                toastError();
            }
        })();
    }

    const handleInputChange = (e) => {
        const { name, value } = e.currentTarget;
        setInput({ ...input, [name]: value });
        setFormError(false)
    }

    const handleToast = () => {
        // add a promise rejection handler
        toast({
            title: "You've been logged in successfully.",
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    }

    const toastError = () => {
        toast({
            title: "This email isn't registered. Sign up",
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }

    const handleClick = () => {
        if (Object.values(input).every(value => value)) {
            (async () => {
                try {
                    const result = await axios.post(`${API_URL}/auth/login`, input);
                    login(result.data.access_token, result.data.refresh_token);
                    setRole("student")
                    setTimeout(() => {
                        navigate("/");
                    }, 1000);
                    handleToast()
                } catch (error) {
                    console.log(error);
                    setFormError(error.response.data.error);
                }
            })();
        } else {
            setFormError("Both fields are required")
        }
    }

    return <>
        <Box display="flex" justifyContent="center">
            <Box display="flex" bg="white" rounded="3xl" boxShadow="xl" maxW="1100px" m="30px" alignItems="center">
                {!isSmallScreen && <Image src="/img/bad-school-1.png" h="100%" w="50%" roundedLeft="3xl" objectFit="cover" />}
                <Box w={{ lg: "50%" }}>
                    <Box m="50px" mb="0px">
                        <Link to="/"><Image src="/img/logo.png" mt="40px" mb="20px" width="100px" height="auto" /></Link>
                        <Text mb={2}>Welcome back! </Text>
                        <Heading mb={2}>Log in to your Account</Heading>
                        <Text>New User? &nbsp;
                            <Link to="/sign-up"><span className="underline"><b>Sign Up.</b></span></Link>
                        </Text>
                    </Box>
                    <Box m="50px" mt="0px" >
                        <Button mt="18px" mb={4} bg="#FFFFFF" border="1px" borderColor="#747775" fontFamily="Roboto" fontWeight={500} rounded="full" color="#1F1F1F" w="100%" onClick={() => loging()}>
                            <Image boxSize="22px" mr="10px" src="/img/google.png" />
                            Sign in with Google
                        </Button>
                        <FormControl mb={3} isInvalid={formError}>
                            <FormLabel>Email Address</FormLabel>
                            <Input placeholder='Enter your email address' w="100%" name="email" value={input.email} onChange={handleInputChange} />
                        </FormControl>
                        <FormControl isInvalid={formError}>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" placeholder='Enter your password' w="100%" name="password" value={input.password} onChange={handleInputChange} />
                            <FormErrorMessage>{formError}</FormErrorMessage>
                        </FormControl>
                        <Button mb="70px"colorScheme="facebook" type="submit" h="40px" w="100%" mt={6} onClick={handleClick}>Sign In</Button>
                        {/* <Flex w="100%" mt={4} justifyContent="center">
                            <Text ><Link to="/">Forgot Password?</Link></Text>
                        </Flex> */}
                    </Box>
                </Box>
            </Box>
        </Box>
    </>
}
