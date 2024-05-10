import { Stat, StatLabel, StatNumber, Box, Heading, Text, Image, Divider, Icon, Button, Alert, AlertIcon, Avatar, Badge, Collapse, useDisclosure } from "@chakra-ui/react";
import { MdSunny } from "react-icons/md";
import { IoMoon } from "react-icons/io5";
import Calander from "../components/Calander";
import { useLocation } from "react-router-dom";
import { useAuth } from '../AuthContext';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import BookingSuccess from "../components/BookingSuccess";

export default function Schedule() {
    const navigate = useNavigate();
    const now = dayjs();
    const offset = dayjs().utcOffset();
    const difference = Math.floor(offset / 60);
    const [selectDate, setSelecteDate] = useState(now);
    const [selectTime, setSelectTime] = useState(null);
    const { getAccess } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [appear, setAppear] = useState(false)
    let location = useLocation();
    let mentor = location.state && location.state.mentor ? location.state.mentor : null;
    console.log(mentor.availability);
    

    useEffect(()=> {
        setSelectTime(null);
        if (selectDate !== now) {
            console.log(selectDate, dayjs())
            console.log("heyy")
            setAppear(true);
        }
    }, [selectDate])

    const generateTime = (time) => {
        // The amount to be added depends on the duration of the session, by default we
        // are assigning all sessions to be 30 mins
        // This function will accept with 0 or 1 as an argument, if arg is 0 then we will return 
        // times for th morning hours, 1 for the evening hours
        // Honestly this function will fail in edge cases for example of the mentor endtime is 16:30
        // The function will miss the session of 16:00 since it depends on hours to end the loop
        // But this might be handled when the mentor select his available times in the first place
        // if he isn't given the option of ending shift unless in a sharp hour
        
        const start = mentor.availability.startTime;
        const end = mentor.availability.endTime;
        const arrayofTimes = [];
        const localtimezoneoffset = dayjs().utcOffset();
        const differenceInHours = Math.floor(localtimezoneoffset / 60);
        

        let [startHours, startMinutes] = start.split(':').map(Number);
        startHours += differenceInHours;
        let [endHours, endMinutes] = end.split(':').map(Number);
        endHours += differenceInHours;

        if (!time) {
            endHours = 12;
        } else {
            startHours = 12
        }

        for (let h = startHours, m = startMinutes; h < endHours; ) {
            arrayofTimes.push(`${h}:${m.toString().padStart(2, '0')}`)
            m += 30
            if (m >= 60) {
                h += 1;
                m -= 60;
            }
             // I'm only adding 30 minutes as a duration for every session
             // Add more to m initially to declare the duration of the session
        }
        // Depending on sessions already booked you can filter the values of the list in this area

        return arrayofTimes
    }

    const handleContinue = () => {
        dayjs.extend(utc);
        const localtimezoneoffset = dayjs().utcOffset();
        const differenceInHours = Math.floor(localtimezoneoffset / 60);
        const newtime = selectTime.split(':').map(Number);
        newtime[0] -= differenceInHours;
        const time = dayjs.utc(selectDate.format('YYYY-MM-DD') + ' ' + newtime.join(':'));
        const duration = dayjs.utc(selectDate.format('YYYY-MM-DD') + ' ' + '00:30'); // this is for the duration of the session which is by default 30 mins for now
        const state = {mentor: mentor.username, date: selectDate.format('YYYY-MM-DD'), time: time.format().slice(0, -1), duration: duration.format().slice(0, -1), status: "Approved", amount: mentor.price_per_hour, method: "auto"};
        (async () => {
            try {
                const result = await axios.request({url: "http://127.0.0.1:5000/sessions/", headers: {Authorization: "Bearer " + getAccess()}, method: "POST", data: state});
                console.log("wohooo!!!!")
                onOpen();
            } catch (error) {
                console.log("An error occured during booking your session, click continue", error);
            }
        })();
    }

    return <Box display="flex"  justifyContent="center">
        <Box display="flex" mb="30px">
            {/* Pick time card */}
            <Box display="flex" p="40px" bg="white"  rounded="xl" m="20px" boxShadow='lg'>
                {/* The calander section */}
                <Box>
                    <Heading fontSize="xl" mb={2}>Schedule your lessons</Heading>
                    <Calander selectDate={selectDate}  setSelecteDate={setSelecteDate} days={mentor.availability.days}/>
                    <Box display="flex" alignItems="center" bg="brand.700" maxW="350px" p="20px" mt="65px" rounded={'xl'} boxShadow={'xl'}>
                        <Image src="/img/flower.png" maxW="80px" mr={4}></Image>
                        <Box color="white">
                            <Heading fontSize={'lg'}>Prepare for your next lesson!</Heading>
                            {selectDate !== now && <Text fontSize={'md'}>On {selectDate.format('dddd, D MMM')}</Text>}
                        </Box>
                    </Box>
                </Box>
                <Divider orientation="vertical" ml={10} mr={10}></Divider>
                <Collapse in={appear} animateOpacity>
                    {/* The part under this must be removed if screen size is small and appear in a popover */}
                    <Box className="horizontal-transition">
                          {/* pick a slot section */}
                          
                          <Box maxW="430px">
                                <Heading fontSize="xl" mb={10}>Pick your slot</Heading>
                                <Box borderLeft="4px" borderColor="brand.700" p="10px" mb={10}>
                                    <Heading fontSize={"lg"} ml={2} mb={2}><Icon as={MdSunny}/>&nbsp;&nbsp;Morning</Heading>
                                    {/* map a list of times to be singly included in their own button */}
                                    <Box display="flex" flexWrap="wrap">
                                        {generateTime(0).map((time, index)=>(
                                            <Button key={index} m="10px" width="80px" isActive={selectTime === time} onClick={()=>setSelectTime(time)}>{time}</Button>
                                        ))}
                                    </Box>
                                </Box>
                                <Box borderLeft="4px" borderColor="brand.800" p="10px">
                                    <Heading fontSize={"lg"} ml={2} mb={2}><Icon as={IoMoon}/>&nbsp;&nbsp;Evening</Heading>
                                    {/* map a list of times to be singly included in their own button */}
                                    <Box display="flex" flexWrap="wrap">
                                        {generateTime(1).map((time, index)=>(
                                            <Button key={index} m="10px" width="80px" isActive={selectTime === time} onClick={()=>setSelectTime(time)}>{time}</Button>
                                        ))}
                                    </Box>
                                </Box>
                                <Alert status='info' maxW="400px" mt="30px" >
                                    <AlertIcon />
                                    All times are shown in your local time zone
                                </Alert>
                            </Box>
                    </Box>
                </Collapse>
            </Box>
            {/* The mentor card */}
            {mentor && 
            <Box bg="brand.800" color="white" rounded="xl" textAlign="center" m="20px" p="30px" boxShadow='lg' maxW="300px" h="auto">
                <Avatar size={'xl'} src={mentor?.profile_picture}/>
                <Heading fontSize="2xl">{mentor.first_name} {mentor.last_name}</Heading>
                <Badge mt={2}colorScheme={mentor.type === "Community" ? 'blue' : 'yellow'}>{mentor.type} Mentor</Badge>
                <Text textAlign="left" mt="20px" mb="20px">{mentor.bio}</Text>
                <Box mt="40px" textAlign="left">
                {selectTime &&
                    <Stat>
                        <StatLabel>Time</StatLabel>
                        <Heading fontSize="xl" mt={1} mb={1}>{selectTime} (UTC +{difference})</Heading>
                        <Divider />
                    </Stat>
                }
                {selectDate !== now && 
                    <Stat>
                        <StatLabel>Date</StatLabel>
                        <Heading mt={1} mb={1} fontSize="xl">{selectDate.format('dddd, D MMM')}</Heading>
                        <Divider />
                    </Stat>
                    }
                    <Stat>
                        <StatLabel>Price</StatLabel>
                        <StatNumber>${mentor.price_per_hour}</StatNumber>
                        <Divider />
                    </Stat>
                </Box>
                <Button isDisabled={!selectTime} colorScheme="orange" mt="40px" onClick={handleContinue}>Continue</Button>

                
            </Box>
            }
            <BookingSuccess isOpen={isOpen} onClose={onClose}/>
        </Box>
    </Box>
}