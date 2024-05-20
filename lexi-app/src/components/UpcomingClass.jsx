import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Flex,
    Box,
    Heading,
    Text,
    Badge,
    Avatar,
    Button, 
    Spacer,
    useDisclosure
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../utils/useAxiosPrivate";
import { API_URL } from '../utils/config';
import AllSessions from './AllSessions';

dayjs.extend(utc);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore)


const statusColors = {
    "Pending": "",
    "Completed": "green",
    "Declined": "red",
    "Approved": "purple"
};

const settingTime = (date, time) => {
    const localtimezoneoffset = dayjs().utcOffset();
    // convert time to datetime and add local timezone offset
    const differenceInHours = Math.floor(localtimezoneoffset / 60);
    const daydiff = { hours: (parseInt(time?.split(':')[0]) + differenceInHours) % 24, day: parseInt(time?.split(':')[0]) + differenceInHours > 24 ? 1 : 0}
    const localTime = { hours: daydiff.hours, minutes: parseInt(time?.split(':')[1]) }
    const newtime = `${localTime.hours}:${localTime.minutes}`
    const dateform = dayjs.utc(date + 'Z').add(daydiff.day, 'day');
    const timeform = dayjs.utc(dayjs().format('YYYY-MM-DD') + ' ' + newtime);

    return dateform.format("DD MMM") + " - " + timeform.format("hh:mm A")
}

const TimeDifference = (day, time) => {
    const localtimezoneoffset = dayjs().utcOffset();
    const difference = Math.floor(localtimezoneoffset / 60);
    const localTime = { hours: parseInt(time?.split(':')[0]) + difference, minutes: parseInt(time?.split(':')[1]) }
    const newtime = `${localTime.hours}:${localTime.minutes}`

    const currentTime = dayjs();
    const sessionTime = dayjs(dayjs.utc(day + 'Z').format('YYYY-MM-DD') + ' ' + newtime);
    const differenceInHours = sessionTime.diff(currentTime, 'hour');
    if (differenceInHours === 0) {
        return `${sessionTime.diff(currentTime, 'minute')} mins`
    }
    return `${differenceInHours} hrs`
}

const sessionNow = (day, time, status) => {
    const localtimezoneoffset = dayjs().utcOffset();
    // convert time to datetime and add local timezone offset
    const differenceInHours = Math.floor(localtimezoneoffset / 60);
    const localTime = { hours: parseInt(time?.split(':')[0]) + differenceInHours, minutes: parseInt(time?.split(':')[1]) }
    const newtime = `${localTime.hours}:${localTime.minutes}`
    if (status === "Approved") {
        const currentTime = dayjs();
        const sessionTime = dayjs(dayjs(day + 'Z').format('YYYY-MM-DD') + ' ' + newtime);            
        if (currentTime.isSame(sessionTime, "date")) {
            if (currentTime.isSameOrAfter(sessionTime)) {
                return (2)
            }
            return (1)
        }
    }
    return (0)
}



function Reschedule({isOpen, onClose, session}) {
    // In this function I will enable the user to reschedule the session if only it has more than 24hrs
    const navigate = useNavigate();

    const hoursLeft = (day, time) => {
        const localtimezoneoffset = dayjs().utcOffset();
        const difference = Math.floor(localtimezoneoffset / 60);
        const localTime = { hours: parseInt(time?.split(':')[0]) + difference, minutes: parseInt(time?.split(':')[1]) }
        const newtime = `${localTime.hours}:${localTime.minutes}`
    
        const currentTime = dayjs();
        const sessionTime = dayjs(dayjs.utc(day + 'Z').format('YYYY-MM-DD') + ' ' + newtime);
        const differenceInHours = sessionTime.diff(currentTime, 'hour');

        return differenceInHours;
    }

    return (
      <>
        <Modal
          isCentered
          onClose={onClose}
          isOpen={isOpen}
          motionPreset='slideInBottom'
          size="xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Session Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <Flex alignItems={'center'} mr={4} gap={6} >
                <Flex alignItems="center">
                    <Avatar size="md" src={session?.mentorDp}></Avatar>
                    <Box ml="15px">
                        <Heading fontSize={'md'}>{session?.mentorName}</Heading>
                        <Text fontSize={'xs'}>{session?.mentorType} Mentor</Text>
                    </Box>
                </Flex>
                    <Text fontSize="md">{settingTime(session?.date, session?.time)}</Text>{/* Date/time: you need to convert it to look readable */}
                    <Spacer />
                    {sessionNow(session?.date, session?.time, session?.status) ?
                        <>
                        {sessionNow(session?.date, session?.time, session?.status) === 2 ?
                        <Button size="xs" colorScheme='teal' onClick={() => navigate(`/room/${session?.id}`)}>Session started!</Button> :
                        <Badge textDecoration="none" colorScheme="teal">Starts in {TimeDifference(session?.date, session?.time)}</Badge>
                        }
                        </> :
                        <><Badge textDecoration="none" colorScheme={statusColors[session?.status]}>{session?.status}</Badge></>
                    }
            </Flex>
            </ModalBody>
            <ModalFooter>
              <Button isDisabled={hoursLeft(session?.date, session?.time) < 24} colorScheme='orange' mr={3} onClick={()=>navigate(`/booking/${session?.mentor.username}`, { state: { mentor: session?.mentor, update: session?.id } })}>
                Reschedule
              </Button>
              <Button variant='ghost' onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }


export default function UpcomingClass({ isLoading, setIsLoading }) {
    const executor = useAxiosPrivate(isLoading, setIsLoading);
    const navigate = useNavigate();
    const [sessions, setSessions] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenRes, onOpen: onOpenRes, onClose: onCloseRes } = useDisclosure();
    const [clickedRow, setClickedRow] = useState(null);


    const followup = async (result) => {
        const sessionsWithMentors = await Promise.all(result.data.sessions.map(async session => {
            const values = await retrieveMentor(session.mentor_id);
            return { ...session, mentorName: values[0], mentorDp: values[1], mentorType: values[2], mentor: values[3] };
        }));
        setSessions(sessionsWithMentors.sort((a, b) => new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`)).sort((b, a) => new Date(b.date) - new Date(a.date)))
    }

    useEffect(() => {
        const gettingSessions = async () => {
            try {
                const response = await executor.get(`/sessions/`);
                followup(response);
            } catch (err) {
                console.error(err);
            }
        }
        gettingSessions();
    }, [])


    const futuresessions= (day) => {
        const currentTime = dayjs();
        const sessionTime = dayjs(day + 'Z');

        // return currentTime.isSameOrBefore(sessionTime, "date");
        return true;
    }


    const retrieveMentor = (mentorId) => {
        return (async () => {
            try {
                const result = await axios.get(`${API_URL}/mentor/${mentorId}`);
                return [`${result.data.mentor.first_name} ${result.data.mentor.last_name}`, result.data.mentor.profile_picture, result.data.mentor.type, result.data.mentor];
            } catch (error) {
                console.error(`An error occured during retrival of ${mentorId} info `, error);
            }
        })();
    }

    const handleClick = (session) => {
        onOpenRes();
        setClickedRow(session);
    }

    // for the student to see all the lessons
    return (<>
        <Flex alignItems={"center"} mb={4} gap={3}>
            <Heading fontSize={"xl"}>Your Lessons</Heading>
            <Spacer></Spacer>
            <Box display="flex" alignItems="center" style={{ cursor: "pointer" }} onClick={onOpen}>
                <Text mr={2}>See All</Text>
                <ArrowForwardIcon />
            </Box>
        </Flex>
        <TableContainer bg="white" rounded="xl" boxShadow="lg" maxH="41vh" overflowY="auto">
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th>Mentor</Th>
                        <Th>Date/Time</Th>
                        <Th>Duration</Th>
                        <Th>Status</Th>
                    </Tr>
                </Thead>
                <Tbody textAlign={'center'}>
                    {!sessions?.filter((session) => futuresessions(session.date))?.length ?
                        <Tr>
                            <Td>
                                <Text m="22px"> No Upcoming classes..</Text>
                            </Td>
                        </Tr>
                        : <>
                            {sessions?.filter((session) => futuresessions(session.date)).map((session, index) => (
                                <Tr key={index} onClick={()=>handleClick(session)} style={{ cursor: "pointer" }}>
                                    {/* Create a for loop for every upcoming session to register it's info  */}
                                    <Td>
                                        <Flex alignItems={'center'} mr={4}>
                                            <Avatar size="md" src={session.mentorDp}></Avatar>
                                            <Box ml="15px">
                                                <Heading fontSize={'md'}>{session.mentorName}</Heading>
                                                <Text fontSize={'xs'}>{session.mentorType} Mentor</Text>
                                            </Box>
                                        </Flex>
                                    </Td>{/* Data of the mentor: name, profile pic, type of mentor */}
                                    <Td>{settingTime(session.date, session.time)}</Td>{/* Date/time: you need to convert it to look readable */}
                                    <Td>{session.duration.substring(3, 5)} min</Td>{/* Duration */}
                                    {sessionNow(session.date, session.time, session.status, session.id) ?
                                        <Td>{sessionNow(session.date, session.time, session.status, session.id) === 2 ?
                                            <Button size="xs" colorScheme='teal' onClick={() => navigate(`/room/${session.id}`)}>Session started!</Button> :
                                            <Badge textDecoration="none" colorScheme="teal">Starts in {TimeDifference(session.date, session.time)}</Badge>
                                        }
                                        </Td> :
                                        <Td><Badge textDecoration="none" colorScheme={statusColors[session.status]}>{session.status}</Badge></Td>
                                    }
                                </Tr>
                            ))}
                        </>
                    }
                </Tbody>
            </Table>
        </TableContainer>
        <AllSessions isOpen={isOpen} onClose={onClose} sessions={sessions}/>
        <Reschedule isOpen={isOpenRes} onClose={onCloseRes} session={clickedRow}/>
        </>
    );
}