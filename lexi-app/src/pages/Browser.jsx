import { Box, Heading, Text, Image, Tag, useBreakpointValue, Center, Button } from '@chakra-ui/react'


export default function Browser () {
    const isLargeScreen = useBreakpointValue({ base: false, lg: true });
    const img = <Image m="20px"src="/img/faces-3.png" maxW={{base: "80%", lg: "40%"}} height="auto" ></Image>

    return <>
        <Box display="flex"  justifyContent="center" bg="brand.800" color="white">
            <Box display={{base: "block", lg: "flex"}}  p="60px" pt="10px" pb="10px" maxW="1200px">
                <Box pt="70px" m={{base: "0px", lg:"10px"}}>
                    <Tag size={'md'} mb={4} variant="outline" color="white" textDecoration="none" borderWidth={2}><Text as="b">1-on-1 Sessions</Text></Tag>
                    <Heading fontSize="4xl" mb={4}>Empower Your Learning Journey with Tailored Mentorship</Heading>
                    <Text fontSize="xl">Whether you're looking to improve your speaking skills, prepare for exams, or simply boost your confidence in English, our mentors are here to help you succeed. Explore our Mentor Directory now and take the first step towards achieving your language learning aspirations.</Text>
                </Box>
                {isLargeScreen ? img : <Center>{img}</Center>}
            </Box>
        </Box>
        <Box display="flex"  justifyContent="center" bg="brand.800" color="white">
            
        </Box>
    </>
}