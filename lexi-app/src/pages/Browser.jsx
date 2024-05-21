import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Checkbox,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    TagCloseButton
  } from '@chakra-ui/react'
import { Box, Heading, Text, Image, Tag, useBreakpointValue, Center, Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { SearchIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react';
import axios from "axios";
import useAxiosPrivate from "../utils/useAxiosPrivate";
import { useAuth } from '../AuthContext';
import BrowsingSection from '../components/BrowsingSection';
import { useNavigate } from 'react-router-dom';


export default function Browser () {
    const executor = useAxiosPrivate();
    const languages = ["English", "Mandarin Chinese", "Hindi", "Spanish", "French", "Standard Arabic", "Bengali", "Portuguese", "Russian", "Urdu", "Indonesian", "Standard German", "Japanese", "Nigerian Pidgin", "Egyptian Spoken Arabic", "Marathi", "Telugu", "Turkish", "Tamil", "Yue Chinese"];
    const isLargeScreen = useBreakpointValue({ base: false, lg: true });
    const img = <Image m="20px"src="/img/faces-3.png" maxW={{base: "80%", lg: "40%"}} height="auto"
    alt="Image" loading="lazy" ></Image>
    const [slider, setSlider] = useState([0, 100]);
    const [checkedLanguages, setCheckedLanguages] = useState([]);
    const [checkedTypes, setCheckedTypes] = useState([]);
    const [search, setSearch] = useState("");
    const [isClicked, setIsClicked] = useState(false);
    const [read, setRead] = useState(false);
    const { logout, role, refreshToken } = useAuth();

    const navigate = useNavigate();

    const afterlogout = () => {
        logout();
        navigate('/')
      }
    
      const handleLogOut = async () => {
        try {
            const response = await executor.delete(`/auth/logout`, {data: {refresh_token: refreshToken}});
            afterlogout();
        } catch (err) {
            console.error(err);
        }
      }
    
      useEffect(() => {
        if (role === "mentor") {
          handleLogOut();
        }
      }, [])
      
    const handleChange = (newValue) => {
        setSlider(newValue);
    };

    const handleReload = () => {
        navigate(0);
    }

    const handleLangChange = (lang) => {
        if (checkedLanguages.includes(lang)) {
            setCheckedLanguages(checkedLanguages.filter(item => item !== lang));
        } else {
            setCheckedLanguages([...checkedLanguages, lang]);
        }
    };

    const handleInputChange = (e) => {
        if (isClicked) {
            setIsClicked(false);
        }
        const { value } = e.currentTarget;
        setSearch(value);
    }

    const handleSearch = (e) => {
        setIsClicked(true);
        setRead(true);
    }

    const handleTypesChange = (type) => {
        if (checkedTypes.includes(type)) {
            setCheckedTypes(checkedTypes.filter(item => item !== type));
        } else {
            setCheckedTypes([...checkedTypes, type]);
        }
    };

    // const [countries, setCountries] = useState([]); 
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get("https://restcountries.com/v3.1/all?fields=name,demonyms");
    //             response.data.sort((a, b) => a.name.common.localeCompare(b.name.common));
    //             setCountries(response.data);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };
    //     fetchData();
    // }, []);
    
    
    return <>
        <Box display="flex"  justifyContent="center" bg="brand.800" color="white">
            <Box display={{base: "block", lg: "flex"}}  p="60px" pb="10px" pt="10px" maxW="1250px">
                <Box pt="70px" m={{base: "0px", lg:"10px"}}>
                    <Tag size={'md'} mb={4} variant="outline" color="white" textDecoration="none" borderWidth={2}><Text as="b">1-on-1 Sessions</Text></Tag>
                    <Heading fontSize="4xl" mb={4}>Empower Your Learning Journey with Tailored Mentorship</Heading>
                    <Text fontSize="xl">Whether you're looking to improve your speaking skills, prepare for exams, or simply boost your confidence in English, our mentors are here to help you succeed. Explore our Mentor Directory now and take the first step towards achieving your language learning aspirations.</Text>
                </Box>
                {isLargeScreen ? img : <Center>{img}</Center>}
            </Box>
        </Box>
        <Box display="flex"  justifyContent="center" >
            {/* search box */}
            <Box p="40px" w={{base:"100%", lg: "50%"}}>
                {isClicked && <Tag mb={2}>{search}<TagCloseButton mr={2} onClick={handleReload}/></Tag>}
                <InputGroup size='md' color="white">
                    <Input
                        boxShadow="md"
                        pr='4.5rem'
                        color='black'
                        placeholder='Search for Mentors'
                        bg="white"
                        value={search}
                        onChange={handleInputChange}
                        isReadOnly={read}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' colorScheme='teal' rounded={"xl"} onClick={handleSearch}>
                            <SearchIcon />
                        </Button>
                    </InputRightElement>
                </InputGroup>
                <Box display="flex" mt={4} justifyContent={"center"} gap={3}>
                    <Menu closeOnSelect={false}>
                        <MenuButton as={Button}  rightIcon={<ChevronDownIcon />} color="white" bg={checkedTypes.length ? "#606060" : "brand.700"} rounded="full"  overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                            <Text display={{base: "none", sm: "block"}}>Type</Text>
                        </MenuButton>
                        <MenuList>
                            <MenuItem>
                                <Checkbox size='sm' colorScheme='red' isChecked={checkedTypes.includes('Professional')} onChange={() => handleTypesChange('Professional')}>Professional mentor</Checkbox>
                            </MenuItem>
                            <MenuItem>
                                <Checkbox size='sm' colorScheme='red' isChecked={checkedTypes.includes('Community')} onChange={() => handleTypesChange('Community')}>Community mentor</Checkbox>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                    <Menu closeOnSelect={false} boundary={"scrollParent"}>
                        <MenuButton as={Button}  rightIcon={<ChevronDownIcon />} color="white" bg={checkedLanguages.length ? "#606060" : "brand.700"} rounded="full" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                            <Text display={{base: "none", sm: "block"}}>Language</Text>
                        </MenuButton>
                        <MenuList height="300px" overflowY="auto">
                            {languages.map((lang) => (
                                <MenuItem key={lang}>
                                    <Checkbox size='sm' colorScheme='red' isChecked={checkedLanguages.includes(lang)} onChange={() => handleLangChange(lang)}>{lang}</Checkbox>
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu closeOnSelect={false}>
                        <MenuButton as={Button}  rightIcon={<ChevronDownIcon />} color="white" bg={(slider[0] !== 0 || slider[1] !== 100) ? "#606060" : "brand.700"} rounded="full"  overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                            <Text display={{base: "none", sm: "block"}}>Price</Text>
                        </MenuButton>
                        <MenuList>
                            <MenuItem> 
                                <Box w="100%" textAlign="center" p="5px">
                                    <RangeSlider defaultValue={[0, 100]} min={4} max={100} step={10}  onChange={handleChange}>
                                        <RangeSliderTrack bg='red.100'>
                                            <RangeSliderFilledTrack bg='brand.700' />
                                        </RangeSliderTrack>
                                        <RangeSliderThumb boxSize={3} index={0} />
                                        <RangeSliderThumb boxSize={3} index={1} />
                                    </RangeSlider>
                                    <Text>$ {slider[0]} - $ {slider[1]}</Text>
                                </Box>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            </Box>
        </Box>
        <BrowsingSection  filter={{type: checkedTypes, languages: checkedLanguages, min_price: slider[0], max_price: slider[1]}} search={isClicked ? search : null} setSearch={setSearch}/>
    </>
}