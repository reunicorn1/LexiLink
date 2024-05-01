import { Box, Card, CardBody, Heading, Avatar, Text, Button, Spacer, Divider, useBreakpointValue, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Badge, Tag, Flex, Spinner } from '@chakra-ui/react'
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { Icon } from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import axios from "axios";
import { useAuth } from '../AuthContext';

export default function BrowsingSection () {
    const { authToken } = useAuth();
    const isLargeScreen = useBreakpointValue({ base: false, md: true });
    const [isClicked, setIsClicked] = useState();
    const [page, setPage] = useState(1);
    const [mentors, setMentors] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [love, setLove] = useState();

    const handleClick = (mentor) => {
        allFavorites();
        setLove(favorites.some((favorite) => (favorite.id === mentor.id)) ? mentor.id : 0);
        setLoading(true);
        setIsClicked(mentor);
        setTimeout(() => {
            setLoading(false);
          }, 1000); 
      };

    const handleLike = (mentor) => {
        if (love === mentor.id){
            setLove(0)
            console.log("deleting the like"); // WTF is this, why removing this line breaks the code!!!
            (async () => {
                try {
                    const result = await axios.request({url: "http://127.0.0.1:5000/student/mentors/favorites/",  headers: {Authorization: "Bearer " + authToken}, method: 'DELETE', data: {mentor: mentor.username}});
                    console.log(`you removed the mentor: ${mentor.first_name} to your favorites`);
                    // add a toast here to show people they added someone to their favorites, or not you're free to do whatever :/
                } catch(error){
                    console.log("An error occured during removal from your favorites: ", error);
                }
            })();
        } else {
            setLove(mentor.id);
            (async () => {
                try {
                    const result = await axios.request({url: "http://127.0.0.1:5000/student/mentors/favorites/",  headers: {Authorization: "Bearer " + authToken}, method: 'POST', data: {mentor: mentor.username}});
                    console.log(`you added the mentor: ${mentor.first_name} to your favorites`);
                    // add a toast here to show people they added someone to their favorites, or not you're free to do whatever :/
                } catch(error){
                    console.log("An error occured during adding a mentor to your favorites: ", error);
                }
            })();
        }
    }

    useEffect(()=> {
        const allMentors = (async () => {
            try {
                const result = await axios.get("http://127.0.0.1:5000/mentor/all/", { params: {page: page} });
                setMentors(result.data.mentors);
                setIsClicked(result.data.mentors[0])
                // here goes any filtering thing or maybe in another function, figure it out
            } catch(error){
                console.log("An error occured during retrival of mentors from the database: ", error);
            }
        })
        allMentors();
    }, [page]);

    const allFavorites = (async () => {
        try {
            const result = await axios.get("http://127.0.0.1:5000/student/mentors/favorites/", { headers: {Authorization: "Bearer " + authToken} });
            setFavorites(result.data.mentors);
            // here goes any filtering thing or maybe in another function, figure it out
        } catch(error){
            console.log("An error occured during retrival of the favorite mentors for this user: ", error);
        }
    });

    useEffect(()=>{
        allFavorites();
        setLove(favorites.some((favorite) => (favorite.id === mentors[0].id)) ? mentors[0].id : 0);
    },[mentors])

    return <Box display="flex" justifyContent="center">
    <Box maxW="1250px" display="flex" justifyContent="center" overflowY="auto">
        {/* scrollable section */}
        <Box m="20px" mr="10px" mt="0px" w="90%" overflowY="auto" height={{base: "auto", md:"150vh"}}>
            {mentors.map((mentor, index) => (
            <Card key={index} borderWidth={1.7} borderColor={isClicked?.id === mentor.id ? "brand.700" : "grey"} m="8px" p="10px" style={{ cursor: "pointer" }} onClick={()=> handleClick(mentor)} >
                <CardBody>
                    <Box display={{base:"block", sm: "flex"}} alignItems="center" textAlign={{base: "center", sm:"left"}} overflow="hidden" whiteSpace="wrap" textOverflow="ellipsis">
                        <Avatar m="10px" mb={3} size={{base: "xl", lg:"2xl"}} src={mentor.profile_picture} />
                        <Box m="10px">
                            <Heading size='md'>{mentor.first_name} {mentor.last_name}</Heading>
                            <Badge colorScheme={mentor.type === "Community" ? 'blue' : 'yellow'}>{mentor.type} Mentor</Badge>
                            <Text>Languages:&nbsp;
                                 <Tag>{mentor.first_language}</Tag> <Tag>{mentor.other_languages}</Tag></Text>
                            <Text mt={2}>{mentor.bio}</Text>
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="flex-end" m="10px" mt="10px" mb="0px">
                        <Heading color="brand.800" size="md">USD {mentor.price_per_hour}</Heading>
                    </Box>
                </CardBody>
            </Card>
        ))}
        </Box>
        {/* fixed section */}
        { isLargeScreen && 

        <Box m="20px" ml="10px"mt="0px" w="100%"  height="150vh" overflowY="auto" top="0">
            {loading ? (
            <Card>
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <Spinner size="xl" color="blue.500" />
                    <Box ml="2">Loading...</Box> {/* Additional text indicating loading */}
                </Box>
            </Card>
      ) : (
            <Card m="8px" >
                <CardBody>
                    <Box display="flex" justifyContent="center" textAlign="center">
                        <Box>
                            <Avatar m="20px" size="2xl" src={isClicked?.profile_picture}></Avatar>
                            <Heading fontSize="3xl">{isClicked.first_name} {isClicked.last_name}</Heading>
                            <Badge colorScheme={isClicked.type === "Community" ? 'blue' : 'yellow'}>{isClicked.type} Mentor</Badge>
                        </Box>
                    </Box>
                    <Box m="20px">
                        <Heading mb={2} fontSize="lg">Languages</Heading>
                        <Flex mb={4} gap={2}>
                            <Tag>{isClicked.first_language}</Tag>
                            <Tag>{isClicked.other_languages}</Tag>
                            <Tag>Arabic</Tag>
                        </Flex>
                        <Heading mb={1} fontSize="lg">Bio</Heading>
                        <Text mb={4}>{isClicked.bio}</Text>
                        <Heading mb={1} fontSize="lg">Expertise</Heading>
                        <Text mb={4}>{isClicked.expertise}</Text>
                        <Divider orientation='horizontal' mb={6}/>
                        <iframe width="100%" height="315"
                        src={isClicked.demo_video}>
                        </iframe>
                        <Accordion mt={4} allowToggle>
                            <AccordionItem>
                                <h2>
                                <AccordionButton>
                                    <Box as='span' flex='1' textAlign='left'>
                                    Read More
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                commodo consequat.
                                </AccordionPanel>
                            </AccordionItem>
                            </Accordion>
                            <Box display="flex" alignItems="center" m="20px">
                                <Button colorScheme="teal" w="80%">Book Now</Button>
                                <Spacer></Spacer>
                                <Icon boxSize="30px" as={!love ? IoMdHeartEmpty : IoMdHeart} onClick={() => handleLike(isClicked)} style={{ cursor: "pointer" }}/>
                            </Box>
                    </Box>
                </CardBody>
            </Card>
            )}
        </Box>
        }
    </Box>
</Box>
}