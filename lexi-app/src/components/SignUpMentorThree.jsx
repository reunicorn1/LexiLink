import { Box, Text, Textarea, Input, Heading, useBreakpointValue, Divider, Flex, FormLabel, Select, Icon, RadioGroup, Radio, Stack, Button, Spacer } from "@chakra-ui/react"
import { useState, useEffect } from "react";
import { BiWorld } from "react-icons/bi";
import { FaGraduationCap } from "react-icons/fa";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import axios from "axios";


export default function SignUpMentorThree ({ input, setInput, onChange, handleStepper, SteppingOver, countries }) {
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const languages = ["English", "Mandarin Chinese", "Hindi", "Spanish", "French", "Standard Arabic", "Bengali", "Portuguese", "Russian", "Urdu", "Indonesian", "Standard German", "Japanese", "Nigerian Pidgin", "Egyptian Spoken Arabic", "Marathi", "Telugu", "Turkish", "Tamil", "Yue Chinese"];
    const checks = ["country", "nationality", "first_language", "type", "expertise", "education"];

    const handleChange = (value) => {
        setInput({ ...input, type: value});
        // setFormError({ ...formError, proficency: ""})
    };


    const disable = () => {
        if (checks.every(check => input[check])) { 
            return false;
        } return true;
    }

    const handleNext = () => {
        handleStepper();
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
                <Heading fontSize="3xl" mb={6}><Icon as={BiWorld}/>&nbsp;&nbsp;How Do You Identify Linguistically?</Heading>
                <Flex alignContent="center" gap={6} justifyContent="center" mb={4}>
                    <Box w="50%">
                        <FormLabel>Country</FormLabel>
                        <Select placeholder='Select your country' name="country" value={input.country} onChange={onChange}>
                            {countries?.map((item, index) => (
                                <option key={index} value={item.name.common}>
                                {item.name.common}
                                </option>
                            ))}
                        </Select>
                    </Box>
                    <Box w="50%">
                        <FormLabel>Nationality</FormLabel>
                        <Select placeholder='Select your nationality' name="nationality" value={input.nationality} onChange={onChange}>
                            {countries?.map((item, index) => (                      
                                <option key={index} value={item.name.common}>
                                   {item.name.common}
                                </option>
                            ))}
                        </Select>
                    </Box>
                </Flex>
                <Box>
                    <FormLabel>First Language</FormLabel>
                    <Select placeholder='Select your first language' name="first_language" value={input.first_language} onChange={onChange}>
                        {languages.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                        ))}
                    </Select>
                </Box>
            </Box>
            <Divider />
            <Box m="30px" mt="50px">
                <Flex>
                    <Heading fontSize="3xl" mb={6}><Icon as={FaGraduationCap}/>&nbsp;&nbsp;What type of teacher are you?</Heading>
                </Flex>
                <Box mr="80px">
                    <RadioGroup mb="30px" name="type"  value={input.type} onChange={handleChange}>
                        <Stack spacing={5} direction='row'>
                            <Radio colorScheme='teal' value='Community'>
                            Community Mentor
                            </Radio>
                            <Spacer />
                            <Radio colorScheme='teal' value='Professional'>
                            Professional Mentor
                            </Radio>
                        </Stack>
                    </RadioGroup>
                </Box>
                <FormLabel>Education</FormLabel>
                <Textarea placeholder="Tell us about your education" name="education" value={input.education} onChange={onChange}/>
                <FormLabel mt={4}>Expertise</FormLabel>
                <Textarea placeholder="Let students know what a class with you will be like!" name="expertise" value={input.expertise} onChange={onChange}/>
            </Box>
            <Flex m="30px" justify="flex-end">
                <Button isDisabled={disable()} colorScheme="teal" onClick={handleNext}>Next</Button>
            </Flex>
        </Box>
    </Box>
    </>
}
