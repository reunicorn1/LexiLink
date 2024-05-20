import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Badge,
    Flex,
    Box,
    Heading,
    Text,
    Avatar
  } from '@chakra-ui/react'
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(utc);
dayjs.extend(isSameOrAfter);

export default function AllSessions ({isOpen, onClose, sessions}) {

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


    return (
        <>
          {/* <Button onClick={onOpen}>Trigger modal</Button>
     */}
          <Modal onClose={onClose} isOpen={isOpen} isCentered size="2xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>All sessions</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <TableContainer maxH="50vh" overflowY="auto">
                    <Table size='sm'>
                        <Thead>
                            <Tr>
                                <Th>Mentor</Th>
                                <Th>Date/Time</Th>
                                <Th>Duration</Th>
                                <Th>Status</Th>
                            </Tr>
                        </Thead>
                            <Tbody textAlign={'center'} >
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
                                            <Td><Badge textDecoration="none" colorScheme={statusColors[session.status]}>{session.status}</Badge></Td>
                                        </Tr>
                                    ))}
                                </>
                            }
                            </Tbody>
                    </Table>
                </TableContainer>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
    )
}