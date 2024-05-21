   import dayjs from "dayjs";
import { Box, Heading, Text, Grid, Spacer } from "@chakra-ui/react";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons'


export default function Calander({selectDate, setSelecteDate, days}) {

    const [today, setToday] = useState(dayjs());

    const disableDays = (day) => {
        // This function will recive a dayjs object and I have to return either true or false 
        // if the day should be disabled or not, if the day is matching one of the days of the list
        // we return true, otherwise false
        // if the days entity changed in the future to be a list make changes accordingly
        const subject = day.format('dddd') // this will convert the number to a string
        const currentDay = dayjs()
        // check for the year here as well
        if (days?.includes(subject) && (((day.date() > currentDay.date() && day.month() === currentDay.month()) || day.month() > currentDay.month()) &&  day.year() === currentDay.year())) {
            return true;
        }
        return false; 
    }

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
    
    const getStyle = (date) => {
        const prop = {
            display: "flex",
            h: "30px",
            w: "30px",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            rounded: "full",
            transition: "background-color 0.2s, color 0.2s"
        };
        if (disableDays(date)) {
            prop._hover = { bg: "black", rounded: "full", color: "white" };
            prop.style = { cursor: "pointer" };
        }

        return prop
    }

    const handleClick = (date) => {
        if (disableDays(date)) {
            setSelecteDate(date);
        }
    }



    return <Grid maxW={{lg: "350px"}} maxH="350px" p="20px" boxShadow="xl">
        <Box w="100%" display="flex" mb={6} p={2} borderBottom="1px" borderColor="grey">
            <Heading fontSize="md">{monthsOfYear[today.month()]} {today.year()}</Heading>
            <Spacer></Spacer>
            <Box display="flex" alignItems="center" gap={2}>
                <ChevronLeftIcon style={{ cursor: "pointer" }} onClick={()=>setToday((dayjs().month() >= today.month() && dayjs().year() === today.year()) ? today : today.month(today.month() - 1))}/> 
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
                <Box key={index} {...getStyle(date)} color={selectDate.toDate().toDateString() === date.toDate().toDateString() ? "white" : today ? "white" : disableDays(date) ? "brand.700" : currentMonth ? "black" : "grey"}  bg={today ? "brand.700" : selectDate.toDate().toDateString() === date.toDate().toDateString() ? "black" : undefined} onClick={()=>handleClick(date)}>
                    {/* In bg I changed the order of priority so I'm fooling the user that today isn't selected tho it is, but he won't be able to tell :p */}
                    <Text as={disableDays(date) ? "b" : undefined}>{date.date()}</Text>
                </Box>
            ))}
        </Grid>
    </Grid>
}
