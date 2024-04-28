import { Box, Flex, Image, Heading, Text, useBreakpointValue } from "@chakra-ui/react"
import { SmallCloseIcon} from '@chakra-ui/icons'
import { useAuth } from '../AuthContext';
import { useState, useEffect } from "react";
import axios from "axios";


export default function Favorites() {
    const isLargeScreen = useBreakpointValue({ base: false, xl: true });
    const { authToken, refresh } = useAuth();
    const [mentors, setMentors] = useState(null);
    // const getMentors = async () => {
    //         try {
    //             const result = await axios.get("http://127.0.0.1:5000/student/mentors/favorites/", { headers: {Authorization: "Bearer " + authToken} } );
    //             console.log(result.data);
    //             setMentors(result.data);
    //             // If email is not used, emailValid should remain true
    //         } catch (error) {
    //             refresh();
    //             if (error.response) {
    //                 console.error("An error occurred:", error);
    //             } 
    //             getMentors();
    //         }
    //       };

    useEffect(() => {
        (async () => {
            try {
                const result = await axios.get("http://127.0.0.1:5000/student/mentors/favorites/", { headers: {Authorization: "Bearer " + authToken} });
                setMentors(result.data.mentors);
                console.log(authToken);
            } catch (error) {
                console.log("An error occurred: in the favorites", error);
            }
        })();
    }, [authToken]);

    // Add a delete api so you make the buttons work, or ignore it totally and move on with your life

    return (
        <>
            {Array.isArray(mentors) && mentors.length > 0 && (
                <>
                    <Box display={{base:"block",  sm:"flex", xl:"block"}} gap={3}>
                    
                        {mentors.map((mentor) => (
                            <Box key={mentor.id} display="flex" bg="brand.700" color="white" rounded="2xl" m="10px" p={2} boxShadow="lg">
                                <Flex alignItems="center" justifyContent="space-between" flex="1">
                                    <Flex alignItems="center">
                                        <Image rounded="full" boxSize="40px" src={mentor.profile_picture} />
                                        <Box ml="15px">
                                            <Heading fontSize="sm">{mentor.first_name} {mentor.last_name}</Heading>
                                            <Text fontSize="xs">{mentor.type} Mentor</Text>
                                        </Box>
                                    </Flex>
                                    <SmallCloseIcon ml="3" />
                                </Flex>
                            </Box>
                        ))}
                    </Box>
                </>
            )}
        </>
    );
}