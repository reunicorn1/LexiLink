import { Box, Heading, Divider, Input, FormLabel, Avatar, Spacer, RadioGroup, Radio, Stack, Flex, Button, Select, useToast } from '@chakra-ui/react'
import { useAuth } from '../AuthContext';
import axios from "axios";
import { useEffect, useState, useRef } from "react";


export default function ProfileInfo() {
    const { getAccess, setUser } = useAuth();
    const fileInputRef = useRef(null);
    // const user = {
    //     "completed_lessons": 0,
    //     "country": "Puerto Rico",
    //     "created_at": "2024-04-25T11:21:35",
    //     "email": "taraalvarado@example.com",
    //     "first_language": "fil",
    //     "first_name": "Sheila",
    //     "id": "74c3c8cc-25bd-4c46-9476-ac20bb880ca8",
    //     "last_name": "Gray",
    //     "nationality": "Guinea-Bissau",
    //     "other_languages": "he",
    //     "proficiency": "3",
    //     "profile_picture": "https://placekitten.com/965/701",
    //     "role": "student",
    //     "updated_at": "2024-04-28T17:56:09",
    //     "username": "catherineowens"
    //   };

    // Notes: I have an issue with the profie picture updating. Rather I have two solutions,
    // We either allow our server to accept files where we upload them there and recieve a url back to retireve information
    // And keep everything stored locally, or use an api to save files in an external server and recieve a link
    // to access the image.


    const [input, setInput] = useState({});
    const [countries, setCountries] = useState([]); 
    const toast = useToast();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setInput({
            ...input,
            profile_picture: file // Store the file object directly (not recommended)
        })
    }

    const handleChange = (value) => {
        setInput({ ...input, proficiency: value});
    };

    const getProfile = (async () => {
        try {
            const result = await axios.get("http://127.0.0.1:5000/student/profile", { headers: {Authorization: "Bearer " + getAccess()} } );
            setInput(result.data);
            setUser(result.data);
        } catch(error) {
            if (error.response.status === 410){
                console.log(error.response);
                refresh();
            }
        }
    });

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
        getProfile();
    }, []);

    const handleToast = async() => {
        // add a promise rejection handler
        await toast({
            title: "Your profile has been updated successfully!",
            status: 'success',
            duration: 3000,
            isClosable: true,
          })();
    }

    const handleClick = () => {
        for (let value in input) {
            if (!input[value]) {
                delete input[value];
            }    
        }
        (async () => {
            try {
                const response = await axios.request({url: "http://127.0.0.1:5000/student/profile",  headers: {Authorization: "Bearer " + getAccess()}, method: 'PUT', data: input} );
                if (response.status == 200) {
                    getProfile();
                    handleToast();
                }
            } catch (error) {
                console.error('Error updating the data of the user', error);
            }
        })();
    }
  
    const handleInputChange = (e) => {
        const { name, value } = e.currentTarget;
        setInput({ ...input, [name]: value });
    }


    return <Box m="30px" mt="0px">
        <Heading fontSize="xl" mb={4}>Personal Information</Heading>
        <Divider orientation='horizontal' mb={4}/>
        <Box>
            <Box  display="flex" gap={10}>
                    <Box  w="70%">
                        <FormLabel>Profile picture</FormLabel>
                        <Input variant='filled' name="profile_picture" value={input.profile_picture} onChange={handleInputChange}></Input>
                        {/* <Input type="file" variant='filled' name="profile_picture" accept="image/png, image/jpeg"></Input> */}
                        <FormLabel mt={3}>First name</FormLabel>
                        <Input variant='filled' name="first_name" value={input.first_name} onChange={handleInputChange}></Input>
                        <FormLabel mt={3}>Last name</FormLabel>
                        <Input variant='filled' name="last_name" value={input.last_name} onChange={handleInputChange}></Input>
                    </Box>
                    <Spacer></Spacer>
                    <Avatar size="2xl" bg="brand.700" src={input.profile_picture}></Avatar>
            </Box>
            <Divider orientation='horizontal' mt={7} mb={5}/>
            <Box w="70%">
                <FormLabel mt={3}>Country</FormLabel>
                <Select variant='filled' name="country" value={input.country} onChange={handleInputChange}>
                         {countries?.map((item, index) => (
                            <option key={index} value={item.name.common}>
                            {item.name.common}
                            </option>
                         ))}
                </Select>
                <FormLabel mt={3}>Nationality</FormLabel>
                <Select variant='filled' name="nationality" value={input.nationality} onChange={handleInputChange}>
                         {countries?.map((item, index) => (
                            <option key={index} value={item.name.common}>
                            {item.name.common}
                            </option>
                         ))}
                </Select>

                <FormLabel mt={3}>First language</FormLabel>
                <Input variant='filled' name="first_language" value={input.first_language} onChange={handleInputChange}></Input>

                <FormLabel mt={3}>Other languages</FormLabel>
                <Input variant='filled' name="other_languages" value={input.other_languages} onChange={handleInputChange}></Input>
            </Box>
            <Divider orientation='horizontal' mt={7} mb={5}/>
            <RadioGroup variant='filled' mb="30px" name="proficiency"  value={input.proficiency} onChange={handleChange}>
                <FormLabel mt={3}>Proficiency</FormLabel>
                <Stack>
                    <Radio mr={1} value='0'>0 - No proficiency</Radio>
                    <Radio mr={1} value='1'>1 - Low proficiency</Radio>
                    <Radio mr={1} value='2'>2 - Intermediate proficiency</Radio>
                    <Radio mr={1} value='3'>3 - Upper Intermediate proficiency</Radio>
                    <Radio mr={1} value='4'>4 - High proficiency</Radio>
                </Stack>
            </RadioGroup>
            <Flex justify="flex-end">
                <Button className="right-aligned" colorScheme="teal" onClick={handleClick}>Save</Button>
            </Flex>
        </Box>
    </Box>
}