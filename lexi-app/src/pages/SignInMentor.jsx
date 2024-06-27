import { Box, Image, useBreakpointValue, Heading, Text, FormControl, FormLabel, Input, Button, Flex, FormErrorMessage, useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from '../AuthContext';
import { API_URL } from '../utils/config';

export default function SignInMentor (  ) {
    const { authToken, login, setRole, role } = useAuth();
    const isSmallScreen = useBreakpointValue({ base: true, lg: false });
    const [input, setInput] = useState({ email: "", password: "", user_type: "mentor"});
    const [formError, setFormError] = useState("");
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        if (role) {
            navigate("/");
        }
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.currentTarget;
        setInput({ ...input, [name]: value });
        setFormError(false)
    }

    const handleToast = async() => {
        await toast({
            title: "You've been logged in successfully.",
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
    }


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
        (async ()=> {
            try {
                const result = await axios.post(`${API_URL}/auth/login`, {email: response.data.email, password: response.data.sub, user_type: "mentor"});
                login(result.data.access_token, result.data.refresh_token);
                setRole("mentor")
                setTimeout(() => {
                    navigate("/mentor/dashboard");
                }, 1000);
                handleToast()
            } catch (error){ 
                toastError(error.response.data.error);
            }
            })();
    }

    const toastError = (error) => {
        toast({
            title: error,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }


    const handleClick = () => {
        if (Object.values(input).every(value => value)) {
            (async ()=> {
                try {
                    const result = await axios.post(`${API_URL}/auth/login`, input);
                    login(result.data.access_token, result.data.refresh_token);
                    setRole("mentor")
                    setTimeout(() => {
                        navigate("/mentor/dashboard");
                    }, 1000);
                    handleToast()
                } catch (error){ 
                    setFormError(error.response.data.error) 
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
                        <Button mt="20px" mb={4} bg="#FFFFFF" border="1px" borderColor="#747775" fontFamily="Roboto" fontWeight={500} rounded="full" color="#1F1F1F" w="90%" onClick={() => loging()}>
                            <Image boxSize="22px" mr="10px" src= "/img/google.png"/>
                            Sign in with Google
                        </Button>
                    </Box> 
                    <Box m="50px" mt="0px">
                    <FormControl mb={3} isInvalid={formError}>
                        <FormLabel>Email Address</FormLabel>
                        <Input placeholder='Enter your email address' w="90%" name="email" value={input.email} onChange={handleInputChange}/>
                        </FormControl>
                        <FormControl isInvalid={formError}>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" placeholder='Enter your password' w="90%" name="password" value={input.password} onChange={handleInputChange}/>
                            <FormErrorMessage>{formError}</FormErrorMessage>
                        </FormControl> 
                        <Button colorScheme="facebook"  type="submit" h="40px" w="90%" mt={6} onClick={handleClick}>Sign In</Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    </>
}