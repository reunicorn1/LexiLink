import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Image,
    Flex,
    Box,
    Heading,
    Text,
    Badge,
  } from '@chakra-ui/react'
  import { useEffect, useState } from 'react';
  import { useAuth } from '../AuthContext';
  import axios from 'axios';
  import dayjs from "dayjs";
  import utc from 'dayjs/plugin/utc';
  dayjs.extend(utc);
  {/*
        --- Every status type has a certain color ---
        <Badge>Pending</Badge> -- pending has no color
        <Badge colorScheme='green'>Completed</Badge>
        <Badge colorScheme='red'>Declined</Badge>
        <Badge colorScheme='purple'>Approved</Badge>

        in the upcoming sessions table we only show the latest three sessions status 
*/}

export default function UpcomingClass() {
    const [sessions, setSessions] = useState();
    const { authToken, getAccess } = useAuth();

    useEffect(() => {
        (async () => {
            try{
                const result = await axios.get("http://127.0.0.1:5000/sessions/", { headers: {Authorization: "Bearer " + getAccess()} })
                setSessions(result.data.sessions.sort((a, b) => b.date - a.date).slice(0, 5))
                console.log(sessions);
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
        const dateform = dayjs.utc(date + 'Z')
        const timeform = dayjs.utc(dayjs().format('YYYY-MM-DD') + ' ' + time);
        return dateform.format("DD MMM") + " - " + timeform.format("hh:mm A")
    }

    return (
        <TableContainer bg="white" rounded="xl" boxShadow="lg">
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
                    {!sessions ?
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
                                    <Image rounded="full" maxW="50px" src="/img/unicorn.png"></Image>
                                    <Box ml="15px">
                                        <Heading fontSize={'md'}>Name of Mentor</Heading>
                                        <Text fontSize={'xs'}>Community Mentor</Text>
                                    </Box>
                                </Flex>
                            </Td>{/* Data of the mentor: name, profile pic, type of mentor */}
                            <Td>{settingTime(session.date, session.time)}</Td>{/* Date/time: you need to convert it to look readable */}
                            <Td>{session.duration.substring(3, 5)} min</Td>{/* Duration */}
                            <Td><Badge textDecoration="none" colorScheme={statusColors[session.status]}>{session.status}</Badge></Td>{/* Status */}
                        </Tr>
                        ))}
                    </>
                    }
                </Tbody>
            </Table>
        </TableContainer>
    );
}