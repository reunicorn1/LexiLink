import { Text, Flex, Box, GridItem, FormControl, FormLabel, Heading, Input, Select, Divider, Stack, Radio, RadioGroup, Button, useBreakpointValue, Tooltip, useDisclosure, FormErrorMessage } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import Success from "./Success";
import { API_URL } from '../utils/config';


const SignUpStepTwo = ({ input, formError, setFormError, onChange, setInput, countries }) => {

    const languages = ["English", "Mandarin Chinese", "Hindi", "Spanish", "Swahili", "French", "Standard Arabic", "Bengali", "Portuguese", "Russian", "Urdu", "Indonesian", "Standard German", "Japanese", "Nigerian Pidgin", "Egyptian Spoken Arabic", "Marathi", "Telugu", "Turkish", "Tamil", "Yue Chinese"];
    const isSmallScreen = useBreakpointValue({ base: true, lg: false });
    const { isOpen, onOpen, onClose } = useDisclosure();
    // I wanted to delete this one, bc it felt very similar to onChange, but the name is just inaccessible in radio
    const handleChange = (value) => {
        setInput({ ...input, proficiency: value});
        // setFormError({ ...formError, proficency: ""})
    };

    const handleOtherElementClick = () => {
        onOpen(); // Open the modal when the other element is clicked
      };

    const handleSubmit = (e) => {
        const errors = { ...formError };
        for (let [key, value] of Object.entries(input)) {
            if (!value) { 
                errors[key] = "This field is required" 
            } else {
                errors[key] = "" 
            }
        }
        setFormError({...errors});
        
        (async () => {
            try{
                const checkuser = await axios.post(`${API_URL}/auth/verify_username`, {username: input.username, user_type: "student"})
                setFormError({...errors})
                console.log(Object.values(input).every(value => value));
                if (Object.values(input).every(value => value)) {
                    // send the data to the end point 
                    (async () => {
                        try {
                            const result = await axios.post(`${API_URL}/auth/signup`, input);
                            handleOtherElementClick();
                            // If email is not used, emailValid should remain true
                        } catch (error) {
                            if (error.response) {
                                console.error("An error occurred:", error);
                            } 
                        }
                      })();
                };
            } catch (error){
                if (error.response && error.response.status === 403) {
                    errors.username = error.response.data.error;
                    setFormError({...errors})
                    
                  } else {
                    console.error("An error occurred:", error);
                  }
            }
        })();
    }


    return <>
            <Box display="flex" justifyContent="center">
              <Box display="grid" p="50px" gridTemplateColumns="10fr 1fr 10fr" gap={6} m="20px"color="black" bg="white" justifyContent="center" rounded="3xl" boxShadow='md'>
                <GridItem colSpan={{base: 3, lg: 1}}>
                    <Heading mb={2}>Let's get to know you better!</Heading>
                    <Text mb={10}>Provide the following details to tailor your learning journey</Text>
                    <FormControl isInvalid={Boolean(formError.username)} mb={3}>
                        <FormLabel>Username</FormLabel>
                        <Input   placeholder="Enter your username" name="username" value={input.username} onChange={onChange}></Input>
                        {formError.username && (<FormErrorMessage>{formError.username}</FormErrorMessage>)}
                    </FormControl>
                    <FormControl  isInvalid={Boolean(formError.first_name)}>
                        <FormLabel>First Name</FormLabel>
                        <Input mb={3} placeholder="Enter your first name" name="first_name" value={input.first_name} onChange={onChange}></Input>
                    </FormControl>
                    <FormControl isInvalid={Boolean(formError.last_name)}>
                        <FormLabel >Last Name</FormLabel>
                        <Input mb={3} placeholder="Enter your last name" name="last_name" value={input.last_name} onChange={onChange}></Input>
                    </FormControl>
                    {/* <FormControl>
                        
                    </FormControl> */}
                    <FormLabel>Country</FormLabel>
                    <Select isInvalid={Boolean(formError.country)} placeholder='Select your country' name="country" value={input.country} onChange={onChange}>
                         {countries?.map((item, index) => (
                            <option key={index} value={item.name}>
                            {item.name}
                            </option>
                         ))}
                    </Select>
                </GridItem >
                {!isSmallScreen && <Divider ml="20px" orientation='vertical' h="500px"></Divider>}
                <GridItem colSpan={{base: 3, lg: 1}}>
                    <FormLabel mt={3}>First Language</FormLabel>
                    <Select isInvalid={Boolean(formError.first_language)}  mb={7} placeholder="Enter your first language" name="first_language" value={input.first_language} onChange={onChange}>
                        {languages.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                        ))}
                    </Select>
                    <FormLabel>Nationality</FormLabel>
                    <Select isInvalid={Boolean(formError.nationality)} mb={7} placeholder='Select your nationality' name="nationality" value={input.nationality} onChange={onChange}>
                         {countries?.map((item, index) => (                      
                            <option key={index} value={item.name}>
                                {item.name}
                            </option>
                         ))}
                    </Select>
                    <FormLabel>How would you describe your English proficiency?</FormLabel>
                    <RadioGroup mb="30px" name="proficiency"  value={input.proficiency} onChange={handleChange}>
                        <Stack>
                            <Flex>
                                <Radio mr={1} value='0'>0 - No proficiency</Radio>
                                <Tooltip placement='right-start' label="I'm just starting to learn English. I can understand basic words and phrases, like greetings and simple questions." fontSize='sm'>
                                    <InfoOutlineIcon /></Tooltip>
                            </Flex>
                            <Flex>
                                <Radio mr={1} value='1'>1 - Low proficiency</Radio>
                                <Tooltip placement='right-start' label="I'm building my English skills. I can express myself in simple sentences and understand basic instructions." fontSize='sm'>
                                    <InfoOutlineIcon /></Tooltip>
                            </Flex>
                            <Flex>
                                <Radio mr={1} value='2'>2 - Intermediate proficiency</Radio>
                                <Tooltip placement='right-start' label="I'm becoming more confident in English. I can hold conversations on familiar topics and understand more complex sentences." fontSize='sm'>
                                    <InfoOutlineIcon /></Tooltip>
                            </Flex>
                            <Flex>
                                <Radio mr={1} value='3'>3 - Upper Intermediate proficiency</Radio>
                                <Tooltip placement='right-start' label="I'm getting pretty good at English. I can understand most conversations and read and write with few mistakes." fontSize='sm'>
                                    <InfoOutlineIcon /></Tooltip>
                            </Flex>
                            <Flex>
                                <Radio mr={1} value='4'>4 - High proficiency</Radio>
                                <Tooltip placement='right-start' label="I'm fluent in English. I can speak, read, and write with ease, almost like a native speaker. I understand idioms and slang, and I can communicate effectively in any situation." fontSize='sm'>
                                    <InfoOutlineIcon /></Tooltip>
                            </Flex>
                        </Stack>
                    </RadioGroup>
                    <Flex justify="flex-end">
                        <Button onClick={handleSubmit} className="right-aligned" colorScheme="facebook">Submit</Button>
                    </Flex>
                </GridItem>
              </Box>
              <Success isOpen={isOpen} link={"/sign-in"}/>
            </Box>
    </>
};
export default SignUpStepTwo;
