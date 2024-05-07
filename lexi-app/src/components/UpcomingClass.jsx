import {
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
    Button
  } from '@chakra-ui/react'
  import { useEffect, useState } from 'react';
  import { useAuth } from '../AuthContext';
  import axios from 'axios';
  import dayjs from "dayjs";
  import utc from 'dayjs/plugin/utc';
  import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
  import { useNavigate } from 'react-router-dom';
  dayjs.extend(utc);
  dayjs.extend(isSameOrAfter);

  {/*
        --- Every status type has a certain color ---
        <Badge>Pending</Badge> -- pending has no color
        <Badge colorScheme='green'>Completed</Badge>
        <Badge colorScheme='red'>Declined</Badge>
        <Badge colorScheme='purple'>Approved</Badge>

        in the upcoming sessions table we only show the latest three sessions status 
*/}

export default function UpcomingClass() {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState();
    const { authToken, getAccess } = useAuth();

    useEffect(() => {
        (async () => {
            try{
                const result = await axios.get("http://127.0.0.1:5000/sessions/", { headers: {Authorization: "Bearer " + getAccess()} })
                const sessionsWithMentors = await Promise.all(result.data.sessions.map(async session => {
                    const values = await retrieveMentor(session.mentor_id);
                    return {...session, mentorName: values[0], mentorDp: values[1], mentorType: values[2]};
                }));
                setSessions(sessionsWithMentors.sort((a, b) => new Date(b.date) - new Date(a.date)))
            } catch(error) {
                console.log(error);
            }
        })();
    }, [])

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
        const localTime = {hours: parseInt(time.split(':')[0]) + differenceInHours, minutes: parseInt(time.split(':')[1])}
        const newtime = `${localTime.hours}:${localTime.minutes}`
        const dateform = dayjs.utc(date + 'Z')
        const timeform = dayjs.utc(dayjs().format('YYYY-MM-DD') + ' ' + newtime);

        return dateform.format("DD MMM") + " - " + timeform.format("hh:mm A")
    }

    const sessionNow = (day, time, status, id) => {
        if (status === "Approved") {
            const currentTime = dayjs();
            const sessionTime = dayjs(dayjs.utc(day + 'Z').format('YYYY-MM-DD')+ ' ' + time);
            if (currentTime.isSame(sessionTime, "date")) {
                if (currentTime.isSameOrAfter(sessionTime)){
                    return (2)
                }
                return (1)
            }
        }
        return (0)
    }
    
    // Apparently I can't get the room after the session time has passed
    // const getRoomId = (async (id) => {
    //     try {
    //         const result = await axios.get(`http://127.0.0.1:5000/sessions/room/${id}`, { headers: {Authorization: "Bearer " + getAccess(), session_id: id} } );
    //         console.log(result.data)
    //         return result.data
    //     } catch (error){
    //         console.log(error);
    //     }
    // });

    const TimeDifference = (day, time) => {
        const currentTime = dayjs();
        const sessionTime = dayjs(dayjs.utc(day + 'Z').format('YYYY-MM-DD')+ ' ' + time);
        const differenceInHours = sessionTime.diff(currentTime, 'hour');
        if (differenceInHours === 0) {
            return `${sessionTime.diff(currentTime, 'minute')} mins`
        }
        return `${differenceInHours} hrs`
    }

    const retrieveMentor = (mentorId) => {
        return (async () => {
            try {
                const result = await axios.get(`http://127.0.0.1:5000/mentor/${mentorId}`);
                return [`${result.data.first_name} ${result.data.last_name}`, result.data.profile_picture, result.data.type];
            } catch (error) {
                console.log(`An error occured during retrival of ${mentorId} info `, error);
            }
        })();
    }


    return (
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
                    {!sessions?.length ?
                    <Tr>
                        <Td>
                            <Text m="22px"> No Upcoming classes..</Text>
                        </Td>
                    </Tr>
                    : <>
                        {sessions.map((session, index) => (
                        <Tr key={index}>
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
                            { sessionNow(session.date, session.time, session.status, session.id) ? 
                                <Td>{sessionNow(session.date, session.time, session.status, session.id) === 2 ? 
                                    <Button size="xs" colorScheme='teal' onClick={()=>navigate(`/room/${session.id}`)}>Session started!</Button> : 
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
    );
}