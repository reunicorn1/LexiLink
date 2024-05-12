import { Grid, Box, Text, Heading, Divider, Spacer, Center } from "@chakra-ui/react";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons'
import dayjs from "dayjs";
import MentorPlanner from "./MentorPlanner";

export default function WeeklyCalander({sessions}) {
    const [today, setToday] = useState(dayjs());
    const [dayClicked, setDayClicked] = useState(today);

    const generateDate = (today) => {

        const now = today;
        const arrayofDates = [];

        // add the 3 days before today
        for (let i = now?.date() - 3; i < now?.date(); i++) {
            arrayofDates.push({
                date: now?.date(i),
                today: now?.date(i).toDate().toDateString() === dayjs().toDate().toDateString()
            })
        }

        // add the 3 days  after today
        for (let i = now?.date(); i <= now?.date() + 3; i++) {
            arrayofDates.push({
                date: now?.date(i),
                today: now?.date(i).toDate().toDateString() === dayjs().toDate().toDateString()
            })
        }
        return arrayofDates;
    }

    const getSessions = (date=dayClicked) => {
        const todaysSessions = sessions.filter(session => dayjs(session.date + 'Z').isSame(date, "day"));
        return todaysSessions.sort((a, b) => new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`));;
    }

    const handleClick = (date) => {
        setDayClicked(date);
    }

    const monthsOfYear = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prop = {
        display: "flex",
        h: "30px",
        w: "30px",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        rounded: "full",
        transition: "background-color 0.2s, color 0.2s",
        _hover: { bg: "black", rounded: "full", color: "white" },
        style: { cursor: "pointer" }
    };

    return <>
    <Box w="100%" overflow="auto" bg="white" p="20px" rounded="xl" boxShadow="lg">
        <Box w="100%" display="flex" mb={6} p={2} borderBottom="1px" borderColor="grey">
            <Heading fontSize="lg">{monthsOfYear[today.month()]} {today.year()}</Heading>
            <Spacer></Spacer>
                <Box display="flex" alignItems="center" gap={2}>
                    <ChevronLeftIcon style={{ cursor: "pointer" }} onClick={()=>setToday(today.day(today.day() - 7))}/> 
                    <Heading fontSize="md" style={{ cursor: "pointer" }} onClick={()=>setToday(dayjs())}>Today</Heading>
                    <ChevronRightIcon style={{ cursor: "pointer" }} onClick={()=>setToday(today.day(today.day() + 7))}/>
                </Box>
        </Box>
        <Box>
            <Grid w="100%" templateColumns="repeat(7, 1fr)" gap={12} justifyContent="center" textAlign="center" mb={4}>
                    {generateDate().map(({date, today}, index) => (
                        <Heading key={`##${index}`} fontSize="sm" h="30px" w="30px">{date.format('dd')}</Heading>
                    ))}
            </Grid>
            <Grid w="100%" templateColumns="repeat(7, 1fr)" gap={12} textAlign="center" justifyContent="center" overflow="auto">
                    {generateDate(today).map(({date, today}, index) => (
                        <Box key={index} {...prop} bg={today ? "brand.600" : dayClicked.isSame(date)  ? "black" : undefined} color={(today || dayClicked.isSame(date)) && "white"} as={today && "b"} onClick={()=>handleClick(date)}>
                            <Text>{date.date()}</Text>
                        </Box>
                    ))}
            </Grid>
        </Box>
        <Box>{!getSessions(dayClicked).length ? 
            <Center><Text mb="10px" mt="30px">No classes are hosted today</Text></Center>
            : <MentorPlanner sessions={getSessions(dayClicked)}/>
        }
        </Box>
    </Box>
    </>
}