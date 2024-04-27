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
    Center,
  } from '@chakra-ui/react'
  {/*
        --- Every status type has a certain color ---
        <Badge>Pending</Badge> -- pending has no color
        <Badge colorScheme='green'>Completed</Badge>
        <Badge colorScheme='red'>Declined</Badge>
        <Badge colorScheme='purple'>Approved</Badge>

        in the upcoming sessions table we only show the latest three sessions status 
*/}

export default function UpcomingClass() {
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
                    {/* if there's no data show that a text of No Lessons booked yet,
                    <Text m="22px"> No Upcoming classes..</Text>
                    */}
                    <Tr>
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
                        <Td>27 Apr - 2:27 PM</Td>{/* Date/time: you need to convert it to look readable */}
                        <Td>30 min</Td>{/* Duration */}
                        <Td><Badge textDecoration="none" colorScheme='green'>Completed</Badge></Td>{/* Status */}
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
    );
}