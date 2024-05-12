import { Box, Flex, Avatar, Heading, IconButton, Spacer } from "@chakra-ui/react"
import { EmailIcon } from '@chakra-ui/icons'
import { useEffect, useState } from "react";
import { useWithRefresh } from '../utils/useWithRefresh';
import axios from 'axios';

export default function Students() {
  const [executor, { isLoading, isSuccess, isRefreshing }] = useWithRefresh({ isImmediate: false });
  const [students, setStudents] = useState();

  useEffect(()=>{
    const gettingStudents = async () => {
      await executor(
          (token) => axios.get("http://127.0.0.1:5000/mentor/students/", { headers: { Authorization: "Bearer " + token } }),
          (result) => setStudents(result.data.students)
      );
    };
    gettingStudents();
  }, [])

  return (
    <>
    {students.length && 
        <Box display="block">
          <Heading m="10px" mt={0} fontSize={"xl"}>Students</Heading>
          <Box display={{ base: "block", sm: "flex", xl: "block" }} gap={3} height={{ xl: "43vh" }} overflowY="auto">
              <Box display="flex" bg="brand.800" color="white" rounded="2xl" m="10px" p={2} boxShadow="lg">
                {/* the relationship of boxes to each other */}
                <Flex alignItems="center" justifyContent="space-between" flex="1">
                  {students?.map((item ,index) => (
                  <Flex key={index} alignItems="center" gap={4} p="8px">
                    <Avatar size="md" src={item.profile_picture} />
                    <Heading fontSize="md">{item.first_name} {item.last_name}</Heading>
                    <Spacer />
                    <IconButton
                      isRound={true}
                      variant='solid'
                      aria-label='Done'
                      fontSize='15px'
                      size="xs"
                      icon={<EmailIcon />}
                    />
                  </Flex>
                  ))}
                </Flex>
              </Box>
          </Box>
        </Box>
      }
    </>
  );
}