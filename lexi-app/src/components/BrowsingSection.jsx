import { Box, Card, CardBody, Heading, Avatar, Text, Button, Spacer, Divider, useBreakpointValue, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Badge, Tag, Flex, Spinner, useDisclosure } from '@chakra-ui/react'
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { Icon } from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import axios from "axios";
import { useAuth } from '../AuthContext';
import SignUpAlert from './SignUpAlert';
import { useNavigate } from 'react-router-dom';
import { useWithRefresh } from '../utils/useWithRefresh';
import { API_URL } from '../utils/config';

export default function BrowsingSection({ filter, search, setSearch }) {
  const { authToken, logout } = useAuth();
  const isLargeScreen = useBreakpointValue({ base: false, md: true });
  const [isClicked, setIsClicked] = useState(null);
  const [page, setPage] = useState(1);
  const [mentors, setMentors] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [love, setLove] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate();
  const [executor, { isLoading, isSuccess, isRefreshing }] = useWithRefresh({ isImmediate: false });


  const handleClick = (mentor) => {
    allFavorites();
    setLove(favorites.some((favorite) => (favorite.id === mentor.id)) ? mentor.id : 0);
    setLoading(true);
    setIsClicked(mentor);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleBook = (mentor) => {
    if (!authToken) {
      onOpen();
    } else {
      navigate(`/booking/${mentor.username}`, { state: { mentor } })
    }
  }

  const handleSearching = async () => {
    if (search) {
      try {
        let number = 1;
        let searchResult = [];
        let mentors;
        do {
          const result = await axios.get(`${API_URL}/mentor/all/`, { params: { page: number } });
          mentors = result.data.mentors;
          searchResult = [...searchResult, ...mentors.filter(item => `${item.first_name} ${item.last_name}`.includes(search))];
          number++;
        } while (mentors.length)
        setMentors(searchResult);
        setIsClicked(searchResult[0])
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleLike = async (mentor) => {
    if (!authToken) {
      onOpen();
    } else {
      if (love === mentor.id) {
        setLove(0)
        await executor(
          (token) => axios.delete(`${API_URL}/student/mentors/favorites/`, { headers: { Authorization: "Bearer " + token }, data: { mentor: mentor.username } }),
          (_) => console.log(`you removed the mentor: ${mentor.first_name} to your favorites`));

      } else {
        setLove(mentor.id);
        await executor(
          (token) => axios.post(`${API_URL}/student/mentors/favorites/`, { mentor: mentor.username }, { headers: { Authorization: "Bearer " + token } }),
          (_) => console.log(`you added the mentor: ${mentor.first_name} to your favorites`));
      }
    }
  }

  const handleLoad = () => {
    setPage(page + 1);
  }

  const filtering = (list) => {
    // Filtering work on the basis of the known structure of the filter list that is given as an argument and 
    // lives here as a global variable.
    // filter is composed of [1] types, [2] langs, and [3] slider. All these are lists that are inspected indepedndetly and decisions are made
    // based on their content.
    if (filter && filter[0]) {
      if (filter[0].length > 0) {
        list = list.filter(item => filter[0].includes(item.type));
      }
      if (filter[1].length > 0) {
        list = list.filter(item => (filter[1].includes(item.first_language) || filter[1].includes(item.other_languages)));
      }
      list = list.filter(item => item.price_per_hour <= filter[2][1] && item.price_per_hour >= filter[2][0]);
    }
    filter = null;
    return list;
  }

  useEffect(() => {
    const allMentors = (async () => {
      try {
        const result = await axios.get(`${API_URL}/mentor/all/`, { params: { page: page } });
        setMentors([...mentors, ...result.data.mentors]);
        if (page === 1) {
          setIsClicked(result.data.mentors[0])
        }
      } catch (error) {
        console.error("An error occured during retrival of mentors from the database: ", error);
      }
    })
    allMentors();
  }, [page]);


  useEffect(() => {
    if (search) {
      handleSearching();
      filter = null;
    } else {
      setSearch("");
    }
  }, [search])

  const allFavorites = async () => {
    if (authToken) {
      await executor(
        (token) => axios.get(`${API_URL}/student/mentors/favorites/`, { headers: { Authorization: "Bearer " + token } }),
        (data) => setFavorites(data.data.mentors))
    }
  };

  useEffect(() => {
    if (authToken) {
      allFavorites();
      setLove(favorites.some((favorite) => (favorite.id === mentors[0]?.id)) ? mentors[0]?.id : 0);
    }
  }, [mentors]) // Mentors is placed here as a dependency bc the setMentors function is asynchronous so I can't apply useEffect and expect to work in it's own, unless I controlled executation
  // And repeated it if necessary.


  return <Box display="flex" justifyContent="center">
    <Box maxW="1200px" display="flex" justifyContent="center" overflowY="auto">
      {/* scrollable section */}
      <Box m="20px" mr="10px" mt="0px" w="90%" overflowY="auto" height={{ base: "auto", md: "150vh" }}>
        {filtering(mentors).map((mentor, index) => (
          <Card key={index} borderWidth={1.7} borderColor={isClicked?.id === mentor.id ? "brand.700" : "grey"} m="15px" p="10px" style={{ cursor: "pointer" }} onClick={() => handleClick(mentor)} >
            <CardBody>
              <Box display={{ base: "block", sm: "flex" }} alignItems="center" textAlign={{ base: "center", sm: "left" }} overflow="hidden" whiteSpace="wrap" textOverflow="ellipsis">
                <Avatar m="10px" mb={3} size={{ base: "xl", lg: "2xl" }} src={mentor.profile_picture} />
                <Box m="10px">
                  <Heading size='md'>{mentor.first_name} {mentor.last_name}</Heading>
                  <Badge colorScheme={mentor.type === "Community" ? 'blue' : 'yellow'}>{mentor.type} Mentor</Badge>
                  <Text mt="3px">Languages:&nbsp;
                    <Tag m="2px">{mentor.first_language}</Tag>
                    {Array.isArray(mentor?.other_languages) ? mentor.other_languages.map((lang, index) => (
                      <Tag key={index} m="2px">{lang}</Tag>
                    )) : <Tag key={index} m="2px">{mentor.other_languages}</Tag>}
                  </Text>
                  <Text mt={2}>{mentor.bio}</Text>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="flex-end" m="10px" mt="10px" mb="0px">
                <Heading color="brand.800" size="md">USD {mentor.price_per_hour}</Heading>
              </Box>
            </CardBody>
          </Card>
        ))}
        {/* I couldn't hide the load more option when you remove the search  // if you can't beat them join them */}
        {!search && <Button w="100%" colorScheme="orange" variant="ghost" onClick={handleLoad}>Load More</Button>}
      </Box>
      {/* fixed section */}
      {(isLargeScreen && mentors.length) &&

        <Box m="20px" ml="10px" mt="0px" w="100%" height="150vh" overflowY="auto" top="0">
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
                    <Heading fontSize="3xl">{isClicked?.first_name} {isClicked?.last_name}</Heading>
                    <Badge colorScheme={isClicked?.type === "Community" ? 'blue' : 'yellow'}>{isClicked?.type} Mentor</Badge>
                  </Box>
                </Box>
                <Box m="20px">
                  <Heading mb={2} fontSize="lg">Languages</Heading>
                  <Flex mb={4} gap={2} flexWrap="wrap">
                    <Tag m="2px">{isClicked?.first_language}</Tag>
                    {Array.isArray(isClicked?.other_languages) ? isClicked.other_languages.map((lang, index) => (
                      <Tag key={index} m="2px">{lang}</Tag>
                    )) : null}
                  </Flex>
                  <Heading mb={1} fontSize="lg">Bio</Heading>
                  <Text mb={4}>{isClicked?.bio}</Text>
                  <Heading mb={1} fontSize="lg">Expertise</Heading>
                  <Text mb={4}>{isClicked?.expertise}</Text>
                  <Divider orientation='horizontal' mb={6} />
                  {/* <iframe width="100%" height="315"
                        src={isClicked?.demo_video}>
                        </iframe> */}
                    <iframe width="100%" height="315" src={isClicked?.demo_video}
                    title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; 
                    picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>                  
                  <Box display="flex" alignItems="center" w="100%" mt={6}>
                    <Button colorScheme="teal" w="80%" onClick={() => handleBook(isClicked)}>Book Now</Button>
                    <Spacer></Spacer>
                    <Icon boxSize="30px" as={!love ? IoMdHeartEmpty : IoMdHeart} onClick={() => handleLike(isClicked)} style={{ cursor: "pointer" }} />
                  </Box>
                </Box>
              </CardBody>
            </Card>
          )}
        </Box>
      }
      <SignUpAlert isOpen={isOpen} onClose={onClose} />
    </Box>
  </Box>
}