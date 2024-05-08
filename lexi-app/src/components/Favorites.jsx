import { Box, Flex, Avatar, Heading, Text, useBreakpointValue, CloseButton } from "@chakra-ui/react"
import { useAuth } from '../AuthContext';
import { useState, useEffect } from "react";
import axios from "axios";


export default function Favorites() {
  const isLargeScreen = useBreakpointValue({ base: false, xl: true });
  const { authToken, refresh } = useAuth();
  const [mentors, setMentors] = useState(null);

  const getMentors = async () => {
    try {
      const result = await axios.get("http://127.0.0.1:5000/student/mentors/favorites/", { headers: { Authorization: "Bearer " + authToken } });
      setMentors(result.data.mentors);
    } catch (error) {
      if (error.response.status === 410) {
        refresh().then(
          data => {
            axios.get("http://127.0.0.1:5000/student/mentors/favorites/",
              { headers: { Authorization: "Bearer " + data } })
              .then(data => setMentors(data.data.mentors))
              .then(_ => console.log('----------favorites is refreshed successfully----------->'))
              .catch(err => console.log("error occured during refreshment", err ))
            console.log(data);
          }
        ).catch(
          error => {
            console.log(error);
          }
        );
      } else {
        console.log("An error occurred: in the favorites", error);
      }
    }
  };


  const handleDelete = (async (mentor) => {
    try {
      const result = await axios.request({ url: "http://127.0.0.1:5000/student/mentors/favorites/", headers: { Authorization: "Bearer " + authToken }, method: 'DELETE', data: { mentor: mentor } });
      getMentors();
    } catch (error) {
      if (error.response.status === 410) {
        refresh().then(
          data => {
            console.log(data);
            axios.request({
              url: "http://127.0.0.1:5000/student/mentors/favorites/",
              headers: { Authorization: "Bearer " + data },
              method: 'DELETE', data: { mentor: mentor }
            })
              .then(_ => getMentors())
              .then(_ => console.log('-----------refreshing the delete process was successful------->'))
              .catch()
          }
        ).catch(
          error => {
            console.log(error);
          }
        );
      } else {
        console.log("An error occurred in deleting the favorites", error);
      }
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
            {mentors.map((mentor) => (
              <Box key={mentor.id} display="flex" bg="brand.700" color="white" rounded="2xl" m="10px" p={2} boxShadow="lg">
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