import { Stat, StatLabel, StatNumber, StatHelpText, Box, Heading, Text, Image, Divider, Icon, Button, Alert, AlertIcon, Avatar, Badge, Flex } from "@chakra-ui/react";
import { MdSunny } from "react-icons/md";
import { IoIosTime } from "react-icons/io";
import { FaCalendarWeek } from "react-icons/fa";
import { IoMoon } from "react-icons/io5";
import Calander from "../components/Calander";
import { useParams, useLocation } from "react-router-dom";

export default function Schedule() {
    const {username} = useParams();

    let location = useLocation();
    let mentor = location.state && location.state.mentor ? location.state.mentor : null;
    console.log(mentor);
   
    return <Box display="flex"  justifyContent="center">
        <Box display="flex" mb="30px">
            {/* Pick time card */}
            <Box display="flex" p="40px" bg="white"  rounded="xl" m="20px" boxShadow='lg'>
                {/* The calander section */}
                <Box>
                    <Heading fontSize="xl" mb={2}>Schedule your lessons</Heading>
                    <Calander />
                    <Box display="flex" alignItems="center" bg="brand.800" maxW="350px" p="20px" mt="65px" rounded={'xl'} boxShadow={'xl'}>
                        <Image src="/img/flower.png" maxW="70px" mr={4}></Image>
                        <Box color="white">
                            <Heading fontSize={'xl'}>Explore Your Mentors</Heading>
                            <Text fontSize={'sm'}>Discover a Welcoming Tutor to Enhance Your English Journey</Text>
                        </Box>
                    </Box>
                </Box>
                {/* The part under this must be removed if screen size is small and appear in a popover */}
                <Divider orientation="vertical" ml={10} mr={10}></Divider>
                {/* pick a slot section */}
                <Box maxW="430px">
                    <Heading fontSize="xl" mb={10}>Pick your slot</Heading>
                    <Box borderLeft="4px" borderColor="brand.700" p="10px" mb={10}>
                        <Heading fontSize={"lg"} ml={2} mb={2}><Icon as={MdSunny}/>&nbsp;&nbsp;Morning</Heading>
                        {/* map a list of times to be singly included in their own but */}
                        <Box display="flex" flexWrap="wrap">
                            <Button m="10px" width="80px">8:00</Button>
                            <Button m="10px" width="80px">8:30</Button>
                            <Button m="10px" width="80px">9:00</Button>
                            <Button m="10px" width="80px">9:30</Button>
                            <Button m="10px" width="80px">10:00</Button>
                            <Button m="10px" width="80px">10:30</Button>
                            <Button m="10px" width="80px">11:00</Button>
                            <Button m="10px" width="80px">11:30</Button>
                        </Box>
                    </Box>
                    <Box borderLeft="4px" borderColor="brand.800" p="10px">
                        <Heading fontSize={"lg"} ml={2} mb={2}><Icon as={IoMoon}/>&nbsp;&nbsp;Evening</Heading>
                        {/* map a list of times to be singly included in their own but */}
                        <Box display="flex" flexWrap="wrap">
                            <Button m="10px" width="80px">1:00</Button>
                            <Button m="10px" width="80px">1:30</Button>
                            <Button m="10px" width="80px">2:00</Button>
                            <Button m="10px" width="80px">3:30</Button>
                            <Button m="10px" width="80px">4:00</Button>
                            <Button m="10px" width="80px">6:30</Button>
                            <Button m="10px" width="80px">8:00</Button>
                            <Button m="10px" width="80px">8:30</Button>
                        </Box>
                    </Box>
                    <Alert status='info' maxW="400px" mt="30px" >
                        <AlertIcon />
                        All times are in Central Time (US & Canada)
                    </Alert>
                </Box>
            </Box>
            {/* The mentor card */}
            {mentor && 
            <Box bg="brand.800" color="white" rounded="xl" textAlign="center" m="20px" p="30px" boxShadow='lg' maxW="300px" h="auto">
                <Avatar size={'xl'} src={mentor?.profile_picture}/>
                <Heading fontSize="2xl">{mentor.first_name} {mentor.last_name}</Heading>
                <Badge mt={2}colorScheme={mentor.type === "Community" ? 'blue' : 'yellow'}>{mentor.type} Mentor</Badge>
                <Text textAlign="left" mt="20px" mb="20px">{mentor.bio}</Text>
                <Box mt="40px" textAlign="left">
                    <Stat>
                        <StatLabel>Time</StatLabel>
                        <Heading fontSize="xl" mt={1} mb={1}>01:00 (GMT+04)</Heading>
                        <Divider />
                    </Stat>
                    <Stat>
                        <StatLabel>Date</StatLabel>
                        <Heading mt={1} mb={1} fontSize="xl">Sat, 18 May</Heading>
                        <Divider />
                    </Stat>
                    <Stat>
                        <StatLabel>Price</StatLabel>
                        <StatNumber>${mentor.price_per_hour}</StatNumber>
                        <Divider />
                    </Stat>
                </Box>
                <Button isDisabled colorScheme="orange" mt="40px">Continue</Button>

                
            </Box>
            }
        </Box>
    </Box>
}