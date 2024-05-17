import { Box, FormControl, FormLabel, Heading, Input, Text, Button, Image, useBreakpointValue, Spacer, FormErrorMessage, Flex,  } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import React from "react"; 
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";

//import { GoogleLogin } from '@react-oauth/google';
//import { jwtDecode } from "jwt-decode";


const SignUpStepOne = ({ input, formError, onChange, onClick, handleGoogle }) => {
	const isSmallScreen = useBreakpointValue({ base: true, lg: false });

	const login = useGoogleLogin({
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
				//console.log(res);
				handleGoogle(res);
			} catch (err) {
				console.log(err);
			}
		}
	  });
	  
	// const responseMessage = (response) => {
	// 	const responsedecoded = jwtDecode(response.credential)
	// 	console.log(responsedecoded);
	// };

	return (
		<>
        <Box display="flex"  justifyContent="center">
            <Box display="flex" bg="white" rounded="3xl" boxShadow="xl" maxW="1100px" m="30px" alignItems="center">
                <Box w={{lg:"50%"}}>
                    <Box m="50px" mb={4} mt="80px">
                        <Link to="/"><Image src="/img/logo.png" mt="40px" mb="20px" width="100px" height="auto"/></Link>
						<Text mb={2}>Register Now</Text>
                        <Heading mb={2}>Sign Up For Free</Heading>
                        <Text>Already have an account?&nbsp;
                            <Link to="/sign-in"><span className="underline"><b>Log in.</b></span></Link>
                        </Text>
						<Button mt={4} bg="#FFFFFF" border="1px" borderColor="#747775" fontFamily="Roboto" fontWeight={500} rounded="full" color="#1F1F1F" w="100%" onClick={() => login()}>
							<Image boxSize="22px" mr="10px" src= "/img/google.png"/>
							Sign up with Google
						</Button>
						{/* <GoogleLogin onSuccess={responseMessage} onError={()=>{console.log('Login Failed')}} /> */}
                    </Box> 
                    <Box m="50px" mt="0px" >
						<FormControl mb={3} isInvalid={Boolean(formError.email)}>
							<FormLabel>Email Address</FormLabel>
							<Input placeholder='Enter your email address' w="100%" name="email" value={input.email} onChange={onChange} />
							{formError.email && (<FormErrorMessage>{formError.email}</FormErrorMessage>)}
						</FormControl>
						<FormControl isInvalid={Boolean(formError.password)}>
							<FormLabel>Password</FormLabel>
							<Input type="password" placeholder='Enter your password' w="100%" name="password" value={input.password} onChange={onChange} />
							{formError.password && (<FormErrorMessage>{formError.password}</FormErrorMessage>)}
						</FormControl>
						<Button colorScheme="facebook" type="submit" h="40px" w="100%" mt={6} mb="50px" onClick={onClick}>Next</Button>
                    </Box>
                </Box>
                {!isSmallScreen && <Image src="/img/hash-1.png" alt="a boy with his teacher" h="100%" w="50%" roundedRight="3xl" objectFit="cover"/>}
            </Box>
        </Box>
    </>
	);
};

export default SignUpStepOne;
