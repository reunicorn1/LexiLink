import { Box, Flex, Avatar, Text, Heading, IconButton, Spacer } from "@chakra-ui/react"
import { EmailIcon } from '@chakra-ui/icons'
import { useEffect, useState } from "react";
import useAxiosPrivate from "../utils/useAxiosPrivate";
import axios from 'axios';
import { API_URL } from '../utils/config';

export default function Students() {
  const executor = useAxiosPrivate();
  const [students, setStudents] = useState();

  useEffect(()=>{
    const gettingStudents = async () => {
      try {
        const response = await executor.get(`/mentor/students/`);
        setStudents(response.data.students)
      } catch (err) {
        console.error(err);
      }
    };
    gettingStudents();
  }, [])

  
  return (
    <>
    {(Array.isArray(students) && students.length) && 
        <Box display="block">
          <Heading m="10px" mt={0} fontSize={"xl"}>Students</Heading>
          <Box display={{ base: "block", sm: "flex", xl: "block" }} gap={3} height={{ xl: "43vh" }} overflowY="auto">
                {/* the relationship of boxes to each other */}
                  {students?.map((item ,index) => (
                  <Flex key={index} bg="brand.800" color="white" rounded="2xl" m="10px" p={3} boxShadow="lg">
                     <Flex alignItems="center" justifyContent="space-between" flex="1">
                      <Flex alignItems="center">
                        <Avatar size="md" src={item.profile_picture} />
                        <Box ml="15px">
                          <Heading fontSize="md">{item.first_name} {item.last_name}</Heading>
                          <Text fontSize="xs">{item.email}</Text>
                        </Box>   
                      </Flex>
                      <Spacer/>
                        <IconButton
                        isRound={true}
                        variant='solid'
                        aria-label='Done'
                        fontSize='15px'
                        size="xs"
                        icon={<EmailIcon />}
                        />
                    </Flex>
                  </Flex>
                  ))}
              </Box>
          </Box>
        }
    </>
  );
}