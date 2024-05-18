import { Spacer, Box, Badge, Button, Image, Text, Flex, Heading, Avatar, Menu, MenuButton, MenuList, MenuItem, Tag } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext';
import axios from "axios";
import { useEffect, useState } from 'react';
import MenuDisplay from './Menu';
import { BellIcon } from '@chakra-ui/icons';
import { API_URL } from '../utils/config';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import useAxiosPrivate from "../utils/useAxiosPrivate";




function BellButton ( {children, pending, setUpdate, update}){
    const executor = useAxiosPrivate();
    const {reload, setReload} = useAuth();



    const settingTime = (date, time) => {
        dayjs.extend(utc);
        const localtimezoneoffset = dayjs().utcOffset();
        // convert time to datetime and add local timezone offset
        const differenceInHours = Math.floor(localtimezoneoffset / 60);
        const localTime = { hours: parseInt(time.split(':')[0]) + differenceInHours, minutes: parseInt(time.split(':')[1]) }
        const newtime = `${localTime.hours}:${localTime.minutes}`
        const dateform = dayjs.utc(date + 'Z')
        const timeform = dayjs.utc(dayjs().format('YYYY-MM-DD') + ' ' + newtime);

        return dateform.format("DD MMM") + " - " + timeform.format("hh:mm A")
    }

    const handleClick = async(value, id) => {
        try {
            const response = await executor.put(`/sessions/${id}`, {status: value});
            setUpdate(!update);
            setReload(!reload);
          } catch (err) {
            console.error(err);
          }
    }

    return <Menu>
                <MenuButton>
                    {children}
                </MenuButton>
                <MenuList  maxH="350px" overflowY="auto">
                    {!pending.length ? 
                    <MenuItem>No Notifications to be displayed</MenuItem> :
                    <>
                    {pending?.map((item, index) => (
                        <MenuItem key={index}>
                            <Flex maxW="300px" gap={4} alignItems="center">
                                <Avatar size="md" src={item?.student_dp} />
                                <Box>
                                    <Text fontSize="sm"><b>{item?.student_name}</b> has requested to have a session with you</Text>
                                    <Text mt={1} color="gray.600" fontSize="sm"><b>{settingTime(item?.date, item?.time)}</b></Text>
                                    <Flex mt={2} gap={3}>
                                        <Tag colorScheme='orange' size="md" onClick={()=>handleClick("Approved", item.id)}>Approve</Tag>
                                        <Tag size="md" onClick={()=>handleClick("Declined", item.id)}>Decline</Tag>
                                    </Flex>
                                </Box>
                            </Flex>
                        </MenuItem>
                    ))}
                    </>
                }
                </MenuList>
            </Menu>
}

export default function MentorNavBar() {
    const { authToken, setUser, role, user } = useAuth();
    const executor = useAxiosPrivate();
    const [notificationCount, setNotificationCount] = useState(0);
    const [sessions, setSessions] = useState([]);
    const [update, setUpdate] = useState(true);


    const followup = async(result) => {
        const sessionsWithStudents = await Promise.all(result.data.sessions.map(async session => {
            const values = await retrieveStudent(session.student_id);
            return { ...session, student_name: values[0], student_dp: values[1], student_email: values[2] };
          }));
          setSessions(sessionsWithStudents.filter(element => element.status === "Pending"))
    }

    useEffect(() => {
        if (authToken) {
            const getProfile = async () => {
                try {
                    const response = await executor.get(`/mentor/profile`);
                    setUser(response.data.profile);
                  } catch (err) {
                    console.error(err);
                  }
            };

            const session_with_refresh = async () => {
                try {
                    const response = await executor.get(`/sessions/`);
                    followup(response);
                } catch (err) {
                    console.error(err);
                }
              };
            getProfile();
            session_with_refresh();
        }
    }, [update]);

    useEffect(()=>{
        setNotificationCount(sessions.length);
    }, [sessions])

    const retrieveStudent = (studentId) => {
        // This function manipulates the content of the session object and adds information about each student linked to the session
        // Including three things: [1] Full name, [2] profile picture, [3] email
          return (async () => {
              try {
                  const result = await axios.get(`${API_URL}/student/${studentId}`);
                  return [`${result.data.student.first_name} ${result.data.student.last_name}`, result.data.student.profile_picture, result.data.student.email];
              } catch (error) {
                  console.log(`An error occured during retrival of ${studentId} info `, error);
              }
          })();
      }

    return (
        <Box display="flex" as="nav" alignItems="center" m="30px" p="30px" h="40px" bg="white" rounded="2xl" boxShadow='base'>
            <Box>
                <Link to='/'><Image src="/img/logo-2.png" alt="Logo" boxSize="auto" width="100px" height="auto" /></Link>
            </Box>
            <Spacer></Spacer>
            {authToken && role === "mentor" ? <Box display="flex" alignItems="center" justifyContent="center">
                <BellButton pending={sessions} setUpdate={setUpdate} update={update}>
                    <Box position="relative">
                        <BellIcon boxSize="2em" />
                        {notificationCount > 0 && (
                            <Badge 
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            textAlign="center"
                            position="absolute" 
                            top="-1px" 
                            right="-1px" 
                            borderRadius="full" 
                            bgColor="red.500" 
                            color="white"
                            fontSize="12px"
                            h="18px"
                            w="18px"
                            >
                            {notificationCount}
                            </Badge>
                        )}
                    </Box>
                </BellButton>
                <Box ml={4} className="image-container">
                    <MenuDisplay>
                        {user.profile_picture ?
                            <Avatar size="sm" bg='red.500' src={user.profile_picture}></Avatar>
                            : <>
                                <Image w="50px" src="/img/profile-2.gif" className="gif-image" ></Image>
                                <Image w="50px" src="/img/profile-2-still.png" className="still-image" ></Image>
                            </>
                        }
                    </MenuDisplay>
                </Box> 
            </Box>:
                <Box>
                    <Link to='/mentor/sign-in'><Button size="sm" colorScheme='facebook' variant='outline' ml="10px">Login</Button></Link>
                    <Link to='/mentor/sign-up' ><Button size="sm" colorScheme='facebook' ml="10px" variant='solid'>Sign up</Button></Link>
                </Box>
            }
        </Box>
    );
};