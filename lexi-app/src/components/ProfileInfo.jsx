import { Box, Heading, Divider, Input, FormLabel, Textarea, Avatar, Spacer, RadioGroup, Radio, Stack, Flex, Button, Select, useToast, Tag, CloseButton, useBreakpointValue, InputRightElement, Spinner, InputGroup } from '@chakra-ui/react'
import { useAuth } from '../AuthContext';
import axios from "axios";
import { useEffect, useState } from "react";
import { useWithRefresh } from '../utils/useWithRefresh';
import useAxiosPrivate from "../utils/useAxiosPrivate";
import { API_URL } from '../utils/config';
import { uploadFile } from '@uploadcare/upload-client'

// fileData must be Blob or File or Buffer


export default function ProfileInfo() {
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const { refresh, setUser, role } = useAuth();
    const executor = useAxiosPrivate();
    //const [executor, { isLoading, isSuccess, isRefreshing }] = useWithRefresh({ isImmediate: false });
    const [input, setInput] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setloading] = useState(false);
    const [countries, setCountries] = useState([]);
    const toast = useToast();
    const uploadcare_api = import.meta.env.VITE_PUBLIC_KEY_UPLOADCARE
    const languages = ["English", "Mandarin Chinese", "Hindi", "Spanish", "French", "Standard Arabic", "Bengali", "Portuguese", "Russian", "Urdu", "Indonesian", "Standard German", "Japanese", "Nigerian Pidgin", "Egyptian Spoken Arabic", "Marathi", "Telugu", "Turkish", "Tamil", "Yue Chinese"];


    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        // fileData must be Blob or File or Buffer
    }

    useEffect(()=>{
        const uploading = async () => {
            if (selectedFile) {
                setloading(true);
                const result = await uploadFile(
                    selectedFile,
                    {
                    publicKey: uploadcare_api,
                    store: 'auto',
                    metadata: {
                        subsystem: 'js-client',
                        pet: 'cat'
                    }
                    }
                )
                setloading(false);
                console.log(result)
                setInput({...input, profile_picture: result.cdnUrl});
            }
        }
        uploading();
    }, [selectedFile])

    const handleChange = (value) => {
        setInput({ ...input, proficiency: value });
    };


    const followup = (result) => {
        setInput(result.data.profile);
        setUser(result.data.profile);
    }

    // const getProfile = (async () => {

    //     await executor(
    //         (token) => axios.get(`${API_URL}/${role}/profile`, { headers: { Authorization: "Bearer " + token } }),
    //         (data) => followup(data)
    //     );
    // });


    const getProfile = (async () => {
        try {
            const response = await executor.get(`/${role}/profile`);
            followup(response);
          } catch (err) {
            //console.log("refreshToken is probably expired");
            console.log(err);
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

    const handleRadio = (value) => {
        setInput({ ...input, type: value});
        // setFormError({ ...formError, proficency: ""})
    };

    const handleToast = () => {

        toast({
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
            await executor(
                (token) => axios.put(`${API_URL}/${role}/profile`, input, { headers: { Authorization: "Bearer " + token } }),
                (_) => {
                    getProfile()
                    handleToast();
                }

            );
        })();
    }


    const handleLangChange = (lang) => {
        console.log(lang);
        let others;
    
        if (input.other_languages.includes(lang)) {
            others = input.other_languages.filter(item => item !== lang);
        } else {
            others = [...input.other_languages, lang]; 
        }
        console.log(input);
        setInput({...input, other_languages: others});
    };

    const handleDelete = (lang) => {
        let others;

        others = input.other_languages.filter(item => item !== lang);
        setInput({...input, other_languages: others});
    }
    

    const handleInputChange = (e) => {
        const { name, value } = e.currentTarget;
        setInput({ ...input, [name]: value });
    }


    return <Box m="30px" mt="0px">
        <Heading fontSize="xl" mb={4}>Personal Information</Heading>
        <Divider orientation='horizontal' mb={4} />
        <Box>
            <Box display="flex" gap={10}>
                <Box w="70%">
                    <FormLabel>Profile picture</FormLabel>
                    {/* <Input variant='filled' name="profile_picture" value={input.profile_picture} onChange={handleInputChange}></Input> */}
                    <InputGroup>
                        <Input type="file" variant='filled' name="profile_picture" accept="image/png, image/jpeg" onChange={handleFileChange} />
                        {loading && <InputRightElement><Spinner /></InputRightElement>}
                    </InputGroup>
                    <FormLabel mt={3}>First name</FormLabel>
                    <Input variant='filled' name="first_name" value={input.first_name} onChange={handleInputChange}></Input>
                    <FormLabel mt={3}>Last name</FormLabel>
                    <Input variant='filled' name="last_name" value={input.last_name} onChange={handleInputChange}></Input>
                    {role === "mentor" && <>
                        <FormLabel mt={4}>Bio</FormLabel>
                        <Textarea variant='filled' placeholder="Tell us about yourself" name="expertise" value={input.bio} onChange={handleInputChange}/>
                    </>}
                </Box>
                <Spacer></Spacer>
                {!isSmallScreen && 
                    <Avatar size="2xl" bg="brand.700" src={input.profile_picture}></Avatar>
                }
            </Box>
            <Divider orientation='horizontal' mt={7} mb={5} />
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

                <FormLabel mt={3}>First Language</FormLabel>
                <Select variant='filled' placeholder='Select your first language' name="first_language" value={input.first_language} onChange={handleInputChange}>
                    {languages.map((item, index) => (
                        <option key={index} value={item}>{item}</option>
                    ))}
                </Select>

                <FormLabel mt={3}>Other Languages</FormLabel>
                <Box display="flex" justifyContent="center" textAlign="center" bg="#EDF2F6" w="100%" rounded="md" minH="40px" p="10px">
                    <Flex w="100%" gap={1} alignItems="center" flexWrap="wrap">
                        {input && Array.isArray(input.other_languages) && input?.other_languages?.map((lang, index) => (
                        <Tag colorScheme='blackAlpha' key={index} size="sm">{lang}&nbsp;&nbsp;<CloseButton fontSize="7px" size="xs" onClick={()=>handleDelete(lang)}/></Tag>
                    ))}
                    </Flex>
                </Box>
                <Select mt={3} multiple size="7" value={input?.other_languages} onChange={(event)=>handleLangChange(event.target.value)}>
                    {languages.map((item, index) => (
                        <option key={index} value={item}>{item}</option>
                    ))}
                </Select>

            </Box>
            <Divider orientation='horizontal' mt={7} mb={5} />
            <Box w="70%">
                {role === "student" ? 
                <RadioGroup variant='filled' mb="30px" name="proficiency" value={input.proficiency} onChange={handleChange}>
                    <FormLabel mt={3}>Proficiency</FormLabel>
                    <Stack>
                        <Radio mr={1} value='0'>0 - No proficiency</Radio>
                        <Radio mr={1} value='1'>1 - Low proficiency</Radio>
                        <Radio mr={1} value='2'>2 - Intermediate proficiency</Radio>
                        <Radio mr={1} value='3'>3 - Upper Intermediate proficiency</Radio>
                        <Radio mr={1} value='4'>4 - High proficiency</Radio>
                    </Stack>
                </RadioGroup>
                : <>
                <RadioGroup mb="30px" variant='filled' name="type" value={input.type} onChange={handleRadio}>
                    <FormLabel mt={3}>Type of Mentor</FormLabel>
                    <Stack spacing={5} direction={{base: 'column', md:'row'}}>
                        <Radio mr={1} colorScheme='teal' value='Community'>Community Mentor</Radio>
                        <Radio mr={1} colorScheme='teal' value='Professional'>Professional Mentor</Radio>
                    </Stack>
                </RadioGroup>
                
                <FormLabel mt={4}>Expertise</FormLabel>
                <Textarea variant="filled" placeholder="Let students know what a class with you will be like!" name="expertise" value={input.expertise} onChange={handleChange}/>
                </>
                }
            </Box>
            <Flex justify="flex-end" mt={7}>
                <Button className="right-aligned" colorScheme="teal" onClick={handleClick}>Save</Button>
            </Flex>
        </Box>
    </Box>
}