import { Box, Image, useBreakpointValue, Heading, Text, FormControl, FormLabel, Input, Button, Flex, FormErrorMessage, useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { useState } from "react";
import { useAuth } from '../AuthContext';

export default function SignUpMentorOne ({ input, formError, onChange, onClick }) {
    const isSmallScreen = useBreakpointValue({ base: true, lg: false });

    const responseMessage = (response) => {
        console.log(response);
    };

    return <>
        <Box display="flex"  justifyContent="center">
            <Box display="flex" bg="white" rounded="3xl" boxShadow="xl" maxW="1100px" m="30px" alignItems="center">
                <Box w={{lg:"50%"}}>
                    <Box m="50px" mb="0px">
                        <Link to="/"><Image src="/img/logo.png" mt="40px" mb="20px" width="100px" height="auto"/></Link>
                        <Heading mb={2}>Start Tutoring on LexiLink</Heading>
                        <Text>Already have an account?&nbsp;
                            <Link to="/mentor/sign-in"><span className="underline"><b>Log in.</b></span></Link>
                        </Text>
                        <Box w="90%" mt="20px">
                            <GoogleLogin buttonText="Sign in with Google" onSuccess={responseMessage} onError={()=>{console.log('Login Failed')}} />
                        </Box>
                    </Box> 
                    <Box m="50px" mt="20px">
                    <FormControl mb={3} isInvalid={Boolean(formError.email)}>
                        <FormLabel>Email Address</FormLabel>
                        <Input placeholder='Enter your email address' w="90%" name="email" value={input.email} onChange={onChange}/>
                        {formError.email && (<FormErrorMessage>{formError.email}</FormErrorMessage>)}
                        </FormControl>
                        <FormControl isInvalid={Boolean(formError.password)}>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" placeholder='Enter your password' w="90%" name="password" value={input.password} onChange={onChange}/>
                            {formError.password && (<FormErrorMessage>{formError.password}</FormErrorMessage>)}
                        </FormControl> 
                        <Button colorScheme="facebook" type="submit" h="40px" w="90%" mt={6} onClick={onClick}>Create Account</Button>
                    </Box>
                </Box>
                {!isSmallScreen && <Image src="/img/icecream.png" h="auto" w="50%" roundedRight="3xl" objectFit="cover"/>}
            </Box>
        </Box>
    </>
}