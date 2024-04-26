import { Box, FormControl, FormLabel, Heading, Input, Text, Button, Image, useBreakpointValue, Spacer, FormErrorMessage, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import React from "react"; 
import { GoogleLogin } from '@react-oauth/google';


const SignUpStepOne = ({ input, formError, onChange, onClick }) => {
const isSmallScreen = useBreakpointValue({ base: true, md: false });

const responseMessage = (response) => {
    console.log(response);
};

return (
    <>
      <Box display="flex" bg="white" h="600px" m={{ base: "60px", xl: "100px" }} rounded="3xl" boxShadow='md'>
        <Box roundedLeft="3xl" w={{ base: "100%", md: "50%" }}>
          <Box m="50px" mb="0px">
            {isSmallScreen && 
              <Flex mb="0px" justify="flex">
                  <Link to="/"><Image src="/img/logo.png" width="100px" height="auto"/></Link>
              </Flex>
            }
            <Text mt={{base:"50px", lg: "100px"}} mb={2}>Register Now</Text>
            <Heading mb={2}>Sign Up For Free</Heading>
            <Text>Already have an account?&nbsp;
              <Link to="/sign-in"><span>Sign In.</span></Link>
            </Text>
            <Box w="85%" mt="20px">
            <GoogleLogin onSuccess={responseMessage} onError={()=>{console.log('Login Failed')}} />
            </Box>      
          </Box>
          <form onSubmit={(e) => e.preventDefault()}> {}
            <FormControl mb={3} isInvalid={Boolean(formError.email)}>
              <FormLabel>Email Address</FormLabel>
              <Input placeholder='Enter your email address' w="85%" name="email" value={input.email} onChange={onChange} />
              {formError.email && (<FormErrorMessage>{formError.email}</FormErrorMessage>)}
            </FormControl>
            <FormControl isInvalid={Boolean(formError.password)}>
              <FormLabel>Password</FormLabel>
              <Input type="password" placeholder='Enter your password' w="85%" name="password" value={input.password} onChange={onChange} />
              {formError.password && (<FormErrorMessage>{formError.password}</FormErrorMessage>)}
            </FormControl>
            <Button colorScheme="facebook" type="submit" h="40px" w="85%" mt={6} onClick={onClick}>Next</Button>
          </form>
        </Box>
        <Spacer />
        {!isSmallScreen &&
          <Box pos="relative">
            <Image src="/img/hash-1.png" alt="a boy with his teacher" boxSize='600px' objectFit="cover" roundedRight="3xl"></Image>
            <Box pos="absolute" width="120px" height="auto" top="10%" left={{ base: '28%', lg: '23%' }} transform="translate(-80%, -50%)">
              <Link to="/"><Image src="/img/logo-2.png" /></Link>
            </Box>
          </Box>
        }
      </Box>
    </>
  );
};

export default SignUpStepOne;
