import { Text, Flex, Box, GridItem, FormControl, FormLabel, Heading, Input, Select, Divider, Stack, Radio, RadioGroup, Button, useBreakpointValue, Tooltip, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import Success from "./Success";

  const SignUpStepTwo = ({ input, formError, setFormError, onChange, setInput }) => {

    const isSmallScreen = useBreakpointValue({ base: true, lg: false });
    const { isOpen, onOpen, onClose } = useDisclosure();
    // I wanted to delete this one, bc it felt very similar to onChange, but the name is just inaccessible in radio
    const handleChange = (value) => {
        setInput({ ...input, proficency: value});
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
        setFormError({...errors})
        if (Object.values(input).every(value => value)) {
            // send the data to the end point 
            (async () => {
                const result = await axios.post("https://127.0.0.1:5000/sign-up", input);
                if (result.status === 200) {
                    handleOtherElementClick();
                } else {
                    console.log("An error occured while sending the form and creating an account")
                }
              })();
        };

    }

    const [countries, setCountries] = useState([]); 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://restcountries.com/v3.1/all?fields=name,demonyms");
                response.data.sort((a, b) => a.name.common.localeCompare(b.name.common));
                setCountries(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return <>
              <Box display="grid" p="50px" gridTemplateColumns="10fr 1fr 10fr" gap={6} m="100px" color="black" bg="white" justifyContent="center" rounded="3xl" boxShadow='md'>
                <GridItem colSpan={{base: 3, lg: 1}}>
                    <Heading mb={2}>Let's get to know you better!</Heading>
                    <Text mb={10}>Provide the following details to tailor your learning journey</Text>
                    <FormControl isInvalid={Boolean(formError.username)} >
                        <FormLabel>Username</FormLabel>
                        <Input mb={3} placeholder="Enter your username" name="username" value={input.username} onChange={onChange}></Input>
                    </FormControl>
                    <FormControl  isInvalid={Boolean(formError.firstname)}>
                        <FormLabel>First Name</FormLabel>
                        <Input mb={3} placeholder="Enter your first name" name="firstname" value={input.firstname} onChange={onChange}></Input>
                    </FormControl>
                    <FormControl isInvalid={Boolean(formError.lastname)}>
                        <FormLabel >Last Name</FormLabel>
                        <Input mb={3} placeholder="Enter your last name" name="lastname" value={input.lastname} onChange={onChange}></Input>
                    </FormControl>
                    <FormControl>
                        
                    </FormControl>
                    <FormLabel>Country</FormLabel>
                    <Select isInvalid={Boolean(formError.country)} placeholder='Select your country' name="country" value={input.country} onChange={onChange}>
                         {countries?.map((item, index) => (
                            <option key={index} value={item.name.common}>
                            {item.name.common}
                            </option>
                         ))}
                    </Select>
                </GridItem >
                {!isSmallScreen && <Divider ml="20px" orientation='vertical' h="500px"></Divider>}
                <GridItem colSpan={{base: 3, lg: 1}}>
                    <FormControl>
                        <FormLabel mt={{md:"70px", xl:"100px"}} >First Language</FormLabel>
                        <Input isInvalid={Boolean(formError.firstlanguage)} mb={3}placeholder="Enter your first language" name="firstlanguage" value={input.firstlanguage} onChange={onChange}></Input>
                    </FormControl>
                    <FormLabel>Nationality</FormLabel>
                    <Select isInvalid={Boolean(formError.nationality)} mb={7} placeholder='Select your nationality' name="nationality" onChange={onChange}>
                         {countries?.map((item, index) => (                      
                            <option key={index} value={item.demonyms.eng.m}>
                                {item.demonyms.eng.m}
                            </option>
                         ))}
                    </Select>
                    <FormLabel>How would you describe your English proficiency?</FormLabel>
                    <RadioGroup mb="30px" defaultValue='1' name="proficiency"  value={input.proficency} onChange={handleChange}>
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
              <Success isOpen={isOpen} />
    </>
};
export default SignUpStepTwo;