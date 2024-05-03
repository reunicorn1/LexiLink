import dayjs from "dayjs";
import { Box, Heading, Text, Grid, Spacer } from "@chakra-ui/react";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons'

const generateDate = (month = dayjs().month(), year = dayjs().year()) => {
    const firstDay = dayjs().year(year).month(month).startOf("month");
    const lastDay =  dayjs().year(year).month(month).endOf("month");

    const arrayOfDate = [];

    // Creating the last days of last month - prefix
    for (let i = 0; i < firstDay.day(); i++) {
        arrayOfDate.push({
            currentMonth: false,
            date: firstDay.day(i)
        })
    }

    // Creating the daya of the month
    for (let i = firstDay.date(); i <= lastDay.date(); i++) {
        arrayOfDate.push({
            currentMonth: true,
            date: firstDay.date(i),
            today: firstDay.date(i).toDate().toDateString() === dayjs().toDate().toDateString()
        })
    }

    const rem = 35 - arrayOfDate.length
    // Creating the first days of next month - suffix
    for (let i = lastDay.date() + 1; i <= lastDay.date() + rem; i++) {
        arrayOfDate.push({
            currentMonth: false,
            date: lastDay.date(i)
        })
    }
    return arrayOfDate;
}

const monthsOfYear = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];


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


export default function Calander() {
    const [today, setToday] = useState(dayjs());
    const [selectDate, setSelecteDate] = useState(dayjs());

    return <Grid maxW="350px" maxH="350px" p="20px" boxShadow="xl">
        <Box w="100%" display="flex" mb={6} p={2} borderBottom="1px" borderColor="grey">
            <Heading fontSize="md">{monthsOfYear[today.month()]} {today.year()}</Heading>
            <Spacer></Spacer>
            <Box display="flex" alignItems="center" gap={2}>
                <ChevronLeftIcon style={{ cursor: "pointer" }} onClick={()=>setToday(today.month(today.month() - 1))}/>
                <Heading fontSize="md" style={{ cursor: "pointer" }} onClick={()=>setToday(dayjs())}>Today</Heading>
                <ChevronRightIcon style={{ cursor: "pointer" }} onClick={()=>setToday(today.month(today.month() + 1))}/>
            </Box>
        </Box>
        <Grid w="100%" templateColumns="repeat(7, 1fr)" gap={2} justifyContent="center" textAlign="center" mb={6}>
            {weekDays.map((day, index) => (
                <Heading key={index} fontSize="sm" w="30px">{day}</Heading>
            ))}
        </Grid>
        <Grid w="100%" templateColumns="repeat(7, 1fr)" gap={2}>
            {generateDate(today.month(), today.year()).map(({date, currentMonth, today}, index) => (
                <Box key={index} {...prop}  color={selectDate.toDate().toDateString() === date.toDate().toDateString() ? "white" : today ? "white" : currentMonth ? "black" : "grey"}  bg={selectDate.toDate().toDateString() === date.toDate().toDateString() ? "black" : today ? "brand.700" : undefined} onClick={()=>setSelecteDate(date)}>
                    <Text>{date.date()}</Text>
                </Box>
            ))}
        </Grid>
    </Grid>
}
