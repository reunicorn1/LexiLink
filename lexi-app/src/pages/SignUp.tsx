import { Box, FormControl, FormLabel, Heading, Input, Text, Button, Image, useBreakpointValue, Spacer, FormErrorMessage } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function SignUp () {
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const [input, setInput] = useState({ email: "", password: "" })
    const [formError, setFormError] = useState({email: false, password: false});
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // This line prevents the default form submission behavior.
        setFormError({ email: !input.email, password: input.password.length < 8 });
      }
    const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setInput({ ...input, [name]: value });
        setFormError({ ...formError, [name]: false})
    }

    return <>
            <Box display="flex" bg="white" h="600px" m={{base:"60px", xl:"100px"}} rounded="3xl">
                <Box  roundedLeft="3xl" w={{base:"100%", md:"50%"}}>
                    <Box m="50px">
                        <Text mt="100px" mb={2}>Register Now</Text>
                        <Heading mb={2}>Sign Up For Free</Heading>
                        <Text>Already have an account?&nbsp;
                            <Link to="/sign-in"><span>Sign In.</span></Link>
                        </Text>
                    </Box>
                    <form onSubmit={handleSubmit}>
                        <FormControl mb={3} isInvalid={formError.email}>
                            <FormLabel>Email Adddress</FormLabel>
                            <Input placeholder='Enter your email adddress' w="85%" name="email" value={input.email} onChange={handleInputChange}/>
                            {formError.email && (<FormErrorMessage> This field is required.</FormErrorMessage>)}
                        </FormControl>
                        <FormControl isInvalid={formError.password}>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" placeholder='Enter your password' w="85%" name="password" value={input.password} onChange={handleInputChange}/>
                            {formError.password && (<FormErrorMessage>This field must be at least 6 characters</FormErrorMessage>)}
                        </FormControl>
                        <Button colorScheme="facebook" type="submit" h="40px"w="85%" mt={6}>Submit</Button>
                    </form>
                </Box>
                <Spacer></Spacer>
                {!isSmallScreen && 
                <Box pos="relative">
                    <Image src="/img/scrap-2.png" alt="a boy with his teacher" boxSize='600px' objectFit="cover" roundedRight="3xl"></Image>
                    <Box pos="absolute"  width="110px" height="auto" top="10%" left={{base:'28%', lg:'23%'}} transform="translate(-80%, -50%)">
                           <Link to="/"><Image src="/img/logo-w.png"/></Link>
                    </Box>
                </Box>
                }
            </Box>
    </>
}