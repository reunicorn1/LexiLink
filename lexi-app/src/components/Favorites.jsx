import { Box, Flex, Avatar, Heading, Text, useBreakpointValue, CloseButton } from "@chakra-ui/react"
import { useAuth } from '../AuthContext';
import { useState, useEffect } from "react";
import axios from "axios";
import { useWithRefresh } from '../utils/useWithRefresh';
import useAxiosPrivate from "../utils/useAxiosPrivate";

import { API_URL } from '../utils/config';

export default function Favorites() {
  const executor = useAxiosPrivate();

  const isLargeScreen = useBreakpointValue({ base: false, xl: true });
  const { authToken, refresh } = useAuth();
  const [mentors, setMentors] = useState(null);
  //const [executor, { isLoading, isSuccess, isRefreshing }] = useWithRefresh({ isImmediate: false });

  // const getMentors = async () => {
  //     await executor(
  //     (token) => axios.get(`${API_URL}/student/mentors/favorites/`, { headers: { Authorization: "Bearer " + token } }),
  //     (data) => {
  //       setMentors(data.data.mentors);
  //     }
  //   )
  // }


  const getMentors = async () => {
    try {
      const response = await executor.get('/student/mentors/favorites/');
      setMentors(response.data.mentors);
    } catch (err) {
      console.error(err);
    }
  }


  const handleDelete = (async (mentor) => {
    try {
      await executor.delete('/student/mentors/favorites/', { data: { mentor: mentor } });
      getMentors();
    } catch (err) {
      console.error(err);
    }
});

useEffect(() => {
  getMentors();
}, []);

return (
  <>
    {Array.isArray(mentors) && mentors.length > 0 && (
      <Box display="block">
        <Heading m="10px" mt={0} fontSize={"xl"}>Favorites</Heading>
        <Box display={{ base: "block", sm: "flex", xl: "block" }} gap={3} height={{ xl: "43vh" }} overflowY="auto">
          {mentors.map((mentor, index) => (
            <Box key={index} display="flex" bg="brand.700" color="white" rounded="2xl" m="10px" p={2} boxShadow="lg">
              <Flex alignItems="center" justifyContent="space-between" flex="1">
                <Flex alignItems="center">
                  <Avatar size="sm" src={mentor.profile_picture} />
                  <Box ml="15px">
                    <Heading fontSize="sm">{mentor.first_name} {mentor.last_name}</Heading>
                    <Text fontSize="xs">{mentor.type} Mentor</Text>
                  </Box>
                </Flex>
                <CloseButton size='sm' ml="3" onClick={() => handleDelete(mentor.username)} />
              </Flex>
            </Box>
          ))}
        </Box>
      </Box>
    )}
  </>
);
}