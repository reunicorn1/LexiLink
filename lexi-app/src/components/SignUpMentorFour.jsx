import { Box, Text, Input, Heading, useBreakpointValue, Divider, Flex, Select, Icon, useDisclosure, Button } from "@chakra-ui/react"
import { useState } from "react";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import { FaCalendarTimes, FaClock } from "react-icons/fa";
import { PiVideoFill } from "react-icons/pi";
import Success from "./Success";
import axios from "axios";
import { API_URL } from '../utils/config';


export default function SignUpMentorFour ({input, setInput, onChange, handleStepper, SteppingOver}) {
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [daysSelected, setDaysSelected] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const createTimes  = (start = "8:00", end = "22:00") => {
        const [startHour, startMinutes] = start.split(':').map(Number);
        const [endHour, endMinutes] = end.split(':').map(Number);
        const arrayOfTimes = [];

        for (let h = startHour, m = startMinutes; h < endHour; m += 30) {
            if (m >= 60) {
                m -= 60;
                h += 1;
            }
            arrayOfTimes.push(`${h}:${m.toString().padStart(2, '0')}`);
        }
        return arrayOfTimes;
    }

    const handleChange = (e) => {
        dayjs.extend(utc);
        const { name, value } = e.currentTarget;
        const availability = {...input.availability};

        availability[name] = value;
        setInput({...input, availability: availability});
    };

    const addtoarray = (name) => {
        if (daysSelected.includes(name)) {
            setDaysSelected(daysSelected.filter(item => item !== name));
        } else {
            setDaysSelected([...daysSelected, name]);
        }
    }

    const cleanup = (time) => {
        const localtimezoneoffset = dayjs().utcOffset();
        const differenceInHours = Math.floor(localtimezoneoffset / 60);

        time.forEach((element, index) => {
            const newtime = input.availability[element].split(':').map(Number);
            newtime[0] -= differenceInHours;
            newtime[1] = newtime[1].toString().padStart(2, '0')

            time[index] = newtime.join(':')
        });
        return time
    }

    const handleSubmit = (async () => {
        const newTime = cleanup(["startTime", "endTime"]);
        
        try {
            await axios.post(`${API_URL}/auth/signup`, {...input, availability: {days: daysSelected, startTime: newTime[0], endTime: newTime[1]}});
            onOpen();
        } catch (error) {
            if (error.response) {
                console.error("An error occurred:", error);
            } 
        }
      });

    return <>
    <Box display="flex" justifyContent="center">
        <Box bg="white" rounded="3xl" m="40px" maxW="800px" boxShadow='md' p="30px">
            {!isSmallScreen && 
            <Box m="30px">
                <SteppingOver/>
            </Box>
            }
            <Divider />
            <Box m="30px">
                <Heading mb={2} fontSize="3xl"><Icon boxSize="26px" as={PiVideoFill}/>&nbsp;&nbsp;Prepare a video introduction</Heading>
                <Text mb={4} >
                At LexiLink, a video introduction is required to showcase your unique teaching style and personality to prospective students. This personalized video is your opportunity to make a lasting impression and demonstrate your passion for teaching.
                </Text>
                <Input mb={6} placeholder="Provide a link for your demo video" name="demo_video" value={input.demo_video} onChange={onChange}></Input>
                <Divider />
                <Heading mb={4} mt={4} fontSize="3xl"><Icon boxSize="23px" as={FaCalendarTimes}/>&nbsp;&nbsp;How's your availability for teaching?</Heading>
                <Flex  mb={4} display="flex" gap={6} flexWrap="wrap" p="10px">
                    {weekdays.map((day, index) => (
                        <Button key={index} isActive={daysSelected.includes(day)} onClick={() => addtoarray(day)}>{day}</Button>
                    ))}
                </Flex>
                <Divider />
                <Heading mb={4} mt={4} fontSize="3xl"><Icon boxSize="23px" as={FaClock}/>&nbsp;&nbsp;What times you want to take sessions on?</Heading>
                <Flex gap={10} p="10px">
                    <Select placeholder='Pick your start time' name="startTime" value={input.availability.startTime} onChange={handleChange}> 
                            {createTimes(undefined, (input.availability.endTime || undefined)).map((item, index) => (
                                <option key={index} value={item}>
                                {item}
                                </option>
                            ))}
                    </Select>
                    {/* I want the second array to start after the start time */}
                    <Select placeholder='Pick your end time' name="endTime" value={input.availability.endTime} onChange={handleChange}> 
                            {createTimes((input.availability.startTime || undefined)).map((item, index) => (
                                <option key={index} value={item}>
                                {item}
                                </option>
                            ))}
                    </Select>
                </Flex>
            </Box>
            <Flex m="30px" justify="flex-end">
                <Button colorScheme="teal" onClick={handleSubmit}>Create an account</Button>
            </Flex>
        </Box>
    </Box>
    <Success isOpen={isOpen} link={"/mentor/sign-in"}/>
    </>
}