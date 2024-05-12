import { Box, Heading, Text, Input, FormControl, Divider, FormLabel, Flex, useBreakpointValue, Button, FormErrorMessage } from "@chakra-ui/react"
import axios from "axios";
import { API_URL } from '../utils/config';

export default function SignUpMentorTwo ({ input, formError, setFormError, onChange, handleStepper, SteppingOver }) {
    const isSmallScreen = useBreakpointValue({ base: true, md: false });

    const handleNext = (async () => {
        const errors = { ...formError };
        try {
            const checkuser = await axios.post(`${API_URL}/auth/verify_username`, {username: input.username, user_type: "mentor"})
            handleStepper();
        } catch(error) {
            if (error.response && error.response.status === 403) {
                errors.username = error.response.data.error;
                setFormError({...errors}) 
            } else {
                console.error("An error occurred:", error);
            }
        }
    })

    const disable = () => {
        if (input.first_name && input.username && input.last_name) { 
            return false;
        } return true;
    }

    return <>
    <Box display="flex" justifyContent="center">
        <Box bg="white" rounded="3xl" m="40px" maxW="800px" boxShadow='md' p="30px">
            {!isSmallScreen && 
            <Box m="30px">
                <SteppingOver/>
            </Box>
            }
            <Divider />
            <Box m="30px">
                <Heading mb={4} fontSize="4xl">Welcome to LexiLink!</Heading>
                <Text fontSize="lg">
                Your presence here opens doors for students to embark on a transformative language learning journey. Through your guidance and expertise, they'll gain the confidence to navigate English with ease. The LexiLink mentor sign-up process ensures a smooth experience, taking you through each step with precision and care.
                </Text>
            </Box>
            <Divider />
            <Box m="30px">
                <Heading mb={4} fontSize="3xl">Let's get to know you!</Heading>
                <Flex alignItems="center" gap={2} justifyContent="center">
                    <FormControl  isInvalid={Boolean(formError.first_name)}>
                        <FormLabel>First Name</FormLabel>
                        <Input w="85%" mb={3} placeholder="Enter your first name" name="first_name" value={input.first_name} onChange={onChange}></Input>
                    </FormControl>
                    <FormControl isInvalid={Boolean(formError.last_name)}>
                        <FormLabel >Last Name</FormLabel>
                        <Input w="85%" mb={3} placeholder="Enter your last name" name="last_name" value={input.last_name} onChange={onChange}></Input>
                    </FormControl>

                </Flex>
                <FormControl isInvalid={Boolean(formError.username)} >
                        <FormLabel>Username</FormLabel>
                        <Input w="93%" placeholder="Enter your username" name="username" value={input.username} onChange={onChange}></Input>
                        {formError.username && (<FormErrorMessage>{formError.username}</FormErrorMessage>)}
                </FormControl>
            </Box>
            <Flex m="30px" justify="flex-end">
                <Button isDisabled={disable()} colorScheme="teal" onClick={handleNext}>Next</Button>
            </Flex>
        </Box>
    </Box>
    </>
}