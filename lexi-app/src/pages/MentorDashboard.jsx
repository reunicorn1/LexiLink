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
    Avatar,
    CircularProgress, 
    useBreakpointValue
  } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../AuthContext';
import axios from "axios";
import WeeklyCalander from "../components/WeeklyCalander";
import Students from "../components/Students";
import useAxiosPrivate from "../utils/useAxiosPrivate";
import dayjs from "dayjs";
import { useState, useEffect, createContext, useContext } from "react";
import { API_URL } from '../utils/config';

const UpdateContext = createContext();

export const useUpdate = () => useContext(UpdateContext);

export default function MentorDashboard () {
  const isLargeScreen = useBreakpointValue({ base: false, xl: true });
  const { user, authToken, refresh, reload, role } = useAuth();
  const [stats, setStats] = useState({ profit: 0, minutes: 0, lessons: 0 });
  const [sessions, setSessions] = useState([]);
  const [update, setUpdate] = useState(false);
  const executor = useAxiosPrivate();


    const navigate = useNavigate();

    useEffect(() => {
      if (!authToken || role !== "mentor") {
        navigate("/");
      }
    }, [])

    const followup = async (result) => {
        const newStats = { profit: 0, minutes: 0, lessons: 0 }
        result.data.sessions.forEach(element => {
          if (element?.status === "Completed") {
            newStats.lessons++;
            newStats.minutes += Number(element.duration.substring(3, 5));
            newStats.profit += Number(user.price_per_hour);
          }
        })
        setStats(newStats);
        const sessionsWithStudents = await Promise.all(result.data.sessions.map(async session => {

          const values = await retrieveStudent(session.student_id);
          return { ...session, student_name: values[0], student_dp: values[1], student_email: values[2] };
        }));
        updateSessions(sessionsWithStudents.sort((a, b) => new Date(b.date) - new Date(a.date)))
      }

    const updateSessions = (sessions) => {
        const updatedSessions = sessions.map(session => {
          const updated_session = {...session}
          const localTimezoneOffset = dayjs().utcOffset();
          const sessionTimeParts = session.time.split(':');
          const sessionHour = parseInt(sessionTimeParts[0], 10);
          const sessionMinute = parseInt(sessionTimeParts[1], 10);
          const newHour = (sessionHour + Math.floor(localTimezoneOffset / 60)) % 24;
          const dayDiff = sessionHour + Math.floor(localTimezoneOffset / 60) >= 24 ? 1 : 0;
          const newTime = `${newHour.toString().padStart(2, '0')}:${sessionMinute.toString().padStart(2, '0')}`;
          const newDate = dayjs(session.date + 'Z').add(dayDiff, 'day');
          updated_session.time = newTime;
          updated_session.date = newDate;

          return updated_session;
      })
      setSessions(updatedSessions);
    }

    useEffect(() => {
        const session_with_refresh = async () => {
          try {
            const response = await executor.get(`/sessions/`);
            followup(response);
          } catch (err) {
            console.error(err);
          }
        };
        session_with_refresh();
      }, [update, reload])


    const retrieveStudent = (studentId) => {
      // This function manipulates the content of the session object and adds information about each student linked to the session
      // Including three things: [1] Full name, [2] profile picture, [3] email
        return (async () => {
          if (studentId) {
            try {
              const result = await axios.get(`${API_URL}/student/${studentId}`);
              return [`${result.data.student.first_name} ${result.data.student.last_name}`, result.data.student.profile_picture, result.data.student.email];
            } catch (error) {
              console.log(`An error occured during retrival of ${studentId} info `, error);
            }
          }
          else {
            return ["Deleted User", "", ""];
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
              </Box>
            </Flex>
            <Box display="flex" m="20px" p="20px" bg="white" boxShadow='lg' rounded={'xl'}>
              <CircularProgress value={(stats.lessons/sessions?.length ) * 100} size='120px' color='brand.800'/>
                <Stat rounded="xl" p="10px" m="10px" ml="15px">
                  <StatLabel fontSize="sm">Total Completed Lessons</StatLabel>
                  <StatNumber fontSize="3xl">{stats.lessons}</StatNumber>
                </Stat>
            </Box>
            {!Object.values(user).every(value => value !== undefined && value !== null) && 
              <Link to="/mentor/profile"><Box display="flex" alignItems="center" bg="brand.700" m="20px" p="20px" rounded={'xl'} boxShadow={'xl'}>
                  <Image src="/img/x.png" maxW="70px" mr={4}></Image>
                  <Box color="white">
                  <Heading fontSize={'xl'}>Alert!</Heading>
                  <Text fontSize={'sm'}>Complete your profile to start accepting sessions with students.</Text>
                  </Box>
              </Box>
              </Link>
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
                      <WeeklyCalander sessions={sessions} setSessions={setSessions} />
                    </UpdateContext.Provider>
                </Box>
                <Box>
                    <Students  />
                </Box>
                
            </Box>
        </Box>
    </Box>
  </>
}  
