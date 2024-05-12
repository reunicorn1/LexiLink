import {
    Box,
    Center,
    Heading,
    Image,
    Flex,
    Text,
    Stat,
    StatLabel,
    StatNumber,
    StatGroup,
    Spacer,
    Avatar,
    CircularProgress, 
    CircularProgressLabel,
    useBreakpointValue
  } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../AuthContext';
import axios from "axios";
import ChartBar from "../components/Chart";
import WeeklyCalander from "../components/WeeklyCalander";
import Students from "../components/Students";
import { useWithRefresh } from '../utils/useWithRefresh';
import { useState, useEffect, createContext, useContext } from "react";

const UpdateContext = createContext();

export const useUpdate = () => useContext(UpdateContext);

export default function MentorDashboard () {
    const isLargeScreen = useBreakpointValue({ base: false, xl: true });
    const { user, authToken, refresh } = useAuth();
    const [executor, { isLoading, isSuccess, isRefreshing }] = useWithRefresh({ isImmediate: false });
    const [stats, setStats] = useState({ profit: 0, minutes: 0, lessons: 0 });
    const [sessions, setSessions] = useState([]);
    const [update, setUpdate] = useState(false);


    const navigate = useNavigate();

    useEffect(() => {
      if (!authToken) {
        navigate("/");
      }
    }, [])

    const followup = async (result) => {
        const newStats = { profit: 0, minutes: 0, lessons: 0 }
        result.data.sessions.forEach(element => {
          if (element.status === "Completed") {
            newStats.lessons++;
            newStats.minutes += Number(element.duration.substring(3, 5));
            newStats.profit += Number(user.price_per_hour);
          }
          //console.log(newStats.profit)
        })
        setStats(newStats);
        const sessionsWithStudents = await Promise.all(result.data.sessions.map(async session => {
          const values = await retrieveStudent(session.student_id);
          return { ...session, student_name: values[0], student_dp: values[1], student_email: values[2] };
        }));
        setSessions(sessionsWithStudents.sort((a, b) => new Date(b.date) - new Date(a.date)))
      }

    useEffect(() => {
        const session_with_refresh = async () => {
          await executor(
            // This endpoint has pagination implemented, so only the first 10 results are retrieved currently
            (token) => axios.get("http://127.0.0.1:5000/sessions/", { headers: { Authorization: "Bearer " + token } }),
            (result) => followup(result)
          )
        };
        session_with_refresh();
      }, [update])


    const retrieveStudent = (studentId) => {
      // This function manipulates the content of the session object and adds information about each student linked to the session
      // Including three things: [1] Full name, [2] profile picture, [3] email
        return (async () => {
            try {
                const result = await axios.get(`http://127.0.0.1:5000/student/${studentId}`);
                return [`${result.data.first_name} ${result.data.last_name}`, result.data.profile_picture, result.data.email];
            } catch (error) {
                console.log(`An error occured during retrival of ${studentId} info `, error);
            }
        })();
    }


    return <>
    <Box display="flex" m="10px" flexDirection={!isLargeScreen ? 'column' : 'row'} justifyContent="center">
        <Flex direction="column" maxW={isLargeScreen ? "500px" : undefined}>
            <Flex m="20px" bg="white" boxShadow='lg' direction="column" textAlign="center" p="30px" rounded={'xl'}>
              <Center>
                  <Avatar size="xl" bg="brand.600" src={user.profile_picture} mb="0px"></Avatar>
              </Center>
              <Center>
                  <Heading mt="10px" mb="3px" size="xl">Hello, {user.first_name}</Heading>
              </Center>
              <Text color="grey">Determination fuels the journey to success.</Text>
              <Box mt="20px">
                  <StatGroup>
                  <Stat rounded="xl" bg="orange.200" p="10px" m="10px">
                      <StatLabel fontSize="md">Minutes</StatLabel>
                      <StatNumber fontSize="3xl">{stats.minutes}</StatNumber>
                  </Stat>

                  <Stat rounded="xl" bg="teal.200" p="10px" m="10px">
                      <StatLabel fontSize="md">Profit</StatLabel>
                      <StatNumber fontSize="3xl">${stats.profit}</StatNumber>
                  </Stat>
                  </StatGroup>
                  {/* <Heading mt={4} fontSize={"2xl"}>Lessons Taught</Heading>
                  <ChartBar/> */}
              </Box>
            </Flex>
            <Box display="flex" m="20px" p="20px" bg="white" boxShadow='lg' rounded={'xl'}>
              <CircularProgress value={(stats.lessons/sessions.length ) * 100} size='120px' color='brand.800'/>
                <Stat rounded="xl" p="10px" m="10px" ml="15px">
                  <StatLabel fontSize="sm">Total Completed Lessons</StatLabel>
                  <StatNumber fontSize="3xl">{stats.lessons}</StatNumber>
                </Stat>
            </Box>
            {!Object.values(user).every(value => value !== undefined && value !== null) && 
              <Box display="flex" alignItems="center" bg="brand.700" m="20px" p="20px" rounded={'xl'} boxShadow={'xl'}>
                  <Image src="/img/x.png" maxW="70px" mr={4}></Image>
                  <Box color="white">
                  <Heading fontSize={'xl'}>Alert!</Heading>
                  <Text fontSize={'sm'}>Complete your profile to start accepting sessions with students.</Text>
                  </Box>
              </Box>
            }
        </Flex>
        <Box>
            {isLargeScreen && <Box m="20px" position="relative">
            <Image h="200px" filter="brightness(55%)" boxShadow="lg" rounded="xl" w="100%" objectFit="cover" src="/img/words.png"></Image>
            <Box color="white" position="absolute" top="10%" p="50px" overflow="hidden">
                <Heading>Learn. Teach. Inspire.</Heading>
                <Text fontSize="lg">"Teaching is the art of lighting a fire, not filling a bucket." - William Butler Yeats</Text>
            </Box>
            </Box>}
            <Box display="flex" flexDirection={!isLargeScreen ? 'column' : 'row'} m="20px" gap="20px">
                {/* This is the box under the banner image */}
                <Box flexGrow={1}>
                    <Heading fontSize={"xl"} mb={4}>Your Planner</Heading>
                    <UpdateContext.Provider value={{setUpdate, update}}>
                      <WeeklyCalander sessions={sessions}/>
                    </UpdateContext.Provider>
                </Box>
                <Box>
                    <Students />
                </Box>
                
            </Box>
        </Box>
    </Box>
  </>
}  
