import { Box, FormControl, FormLabel, Heading, Input, Text, Button, Image, useBreakpointValue, Spacer, FormErrorMessage } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import React from "react"; 
import { GoogleLogin } from '@react-oauth/google';


interface SignUpStepOneProps {
  input: {
    email: string;
    password: string;
  };
  formError: {
    email: string;
    password: string;
  };
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; 
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void; 
}

const SignUpStepOne: React.FC<SignUpStepOneProps> = ({ input, formError, onChange, onClick }) => {
const isSmallScreen = useBreakpointValue({ base: true, md: false });

const responseMessage = (response: any) => {
    console.log(response);
};

return (
    <>
      <Box display="flex" bg="white" h="600px" m={{ base: "60px", xl: "100px" }} rounded="3xl">
        <Box roundedLeft="3xl" w={{ base: "100%", md: "50%" }}>
          <Box m="50px">
            <Text mt="100px" mb={2}>Register Now</Text>
            <Heading mb={2}>Sign Up For Free</Heading>
            <Text>Already have an account?&nbsp;
              <Link to="/sign-in"><span>Sign In.</span></Link>
            </Text>
            <GoogleLogin onSuccess={responseMessage} onError={()=>{console.log('Login Failed')}} />
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
            <Image src="/img/scrap-2.png" alt="a boy with his teacher" boxSize='600px' objectFit="cover" roundedRight="3xl"></Image>
            <Box pos="absolute" width="110px" height="auto" top="10%" left={{ base: '28%', lg: '23%' }} transform="translate(-80%, -50%)">
              <Link to="/"><Image src="/img/logo-w.png" /></Link>
            </Box>
          </Box>
        }
      </Box>
    </>
  );
};

export default SignUpStepOne;
