import {
    Table,
    Flex,
    Tbody,
    Thead,
    Tr,
    Th,
    Td,
    TableContainer,
    Text,
    Box,
    Badge,
    useDisclosure,
  } from '@chakra-ui/react'
import dayjs from "dayjs";
import { useState } from 'react';
import UpdateModal from './UpdateModal';

export default function MentorPlanner({sessions}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [clickedRow , setClickedRow] = useState(null);

    const printTime = (time) => {
        // This function is made to correct the time zone difference
        const localtimezoneoffset = dayjs().utcOffset();
        const differenceInHours = Math.floor(localtimezoneoffset / 60);
        const newtime = time.split(':').map(Number);
        newtime[0] += differenceInHours;
        newtime[1] = newtime[1].toString().padStart(2, '0');

        return `${newtime[0]}:${newtime[1]}`;
    }

    const sessionNow = (day, time, status) => {
        if (status === "Approved") {
            const currentTime = dayjs();
            const sessionTime = dayjs(dayjs.utc(day + 'Z').format('YYYY-MM-DD') + ' ' + time);
            if (currentTime.isSame(sessionTime, "date")) {
                if (currentTime.isSameOrAfter(sessionTime)) {
                    return (2)
                }
                return (1)
            }
        }
        return (0)
    }

    const TimeDifference = (day, time) => {
        const currentTime = dayjs();
        const sessionTime = dayjs(dayjs.utc(day + 'Z').format('YYYY-MM-DD') + ' ' + time);
        const differenceInHours = sessionTime.diff(currentTime, 'hour');
        if (differenceInHours === 0) {
            return `${sessionTime.diff(currentTime, 'minute')} mins`
        }
        return `${differenceInHours} hrs`
    }

    const statusColors = {
        "Pending": "",
        "Completed": "green",
        "Declined": "red",
        "Approved": "purple"
    };

    const handleClick = (session) => {
        onOpen();
        setClickedRow(session);
    }


    return <>
        <TableContainer mt="20px">
            <Table size='md'>
                <Thead>
                    <Tr>
                        <Th></Th>
                        <Th>Time</Th>
                        <Th>Student's Name</Th>
                        <Th>Status</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {sessions.map((item, index) => (
                    <Tr key={index} onClick={()=>handleClick(item)} style={{ cursor: "pointer" }}>
                        <Td>
                            <Box h="10px" w="10px" bg={sessionNow(item.date, item.time, item.status) === 2 ? "teal" : "grey"} rounded="full" mr="20px"/>
                        </Td>
                        <Td>
                            <Text>{printTime(item.time)}</Text>
                        </Td>
                        <Td>{item.student_name}</Td>
                        {sessionNow(item.date, item.time, item.status) ?
                            <Td>{sessionNow(item.date, item.time, item.status) === 2 ?
                            <Button size="xs" colorScheme='teal' onClick={() => navigate(`/room/${item.id}`)}>Session started!</Button> :
                            <Badge textDecoration="none" colorScheme="teal">Starts in {TimeDifference(item.date, item.time)}</Badge>}</Td> :
                            <Td><Badge textDecoration="none" colorScheme={statusColors[item.status]}>{item.status}</Badge></Td>
                        }
                    </Tr>
                ))}
                </Tbody>
            </Table>
        </TableContainer>
        <UpdateModal isOpen={isOpen} onClose={onClose} session={clickedRow}/>
    </>
}