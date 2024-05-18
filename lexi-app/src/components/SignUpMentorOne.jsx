import { Box, Image, useBreakpointValue, Heading, Text, FormControl, FormLabel, Input, Button, Flex, FormErrorMessage, useToast } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";


export default function SignUpMentorOne ({ input, formError, onChange, onClick, handleGoogle }) {
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
                        <Button mt={4} bg="#FFFFFF" border="1px" borderColor="#747775" fontFamily="Roboto" fontWeight={500} rounded="full" color="#1F1F1F" w="90%" onClick={() => login()}>
							<Image boxSize="22px" mr="10px" src= "/img/google.png"/>
							Sign up with Google
						</Button>
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