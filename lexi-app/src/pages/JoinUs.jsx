import { Box, Heading, Text, Image, useBreakpointValue, Tag, Center, Button, Card, CardHeader, CardBody, CardFooter, SimpleGrid } from "@chakra-ui/react"


export default function JoinUs () {
    const isLargeScreen = useBreakpointValue({ base: false, lg: true });
    const img = <Image m="20px"src="/img/mentor.png" maxW={{base: "80%", lg: "40%"}} height="auto"></Image>

    return <Box>
            <Box display="flex"  justifyContent="center" bg="brand.100" color="white">
                <Box display={{base: "block", md: "flex"}} p="60px" pb="5px" pt="10px" maxW="1250px" >
                        {isLargeScreen ? img : <Center>{img}</Center>}  
                        <Box p="20px" pt="70px" m={{base: "0px", lg:"10px"}}>
                            <Tag size={'md'} mb={4} variant="outline" color="white" textDecoration="none" borderWidth={2}><Text as="b">Tutor anytime, anywhere</Text></Tag>
                            <Heading fontSize="4xl" mb={4}>Become a LexiLink Mentor</Heading>
                            <Text fontSize="xl">Are you passionate about helping others learn English and eager to share your knowledge and expertise? Join our community of mentors at LexiLink and make a difference in the lives of language learners around the world.</Text>
                            <Button size="lg" mt="30px">Get Started Now</Button>
                        </Box>
                    </Box>
            </Box>
            <Center><Heading fontSize="3xl" m="30px"  mt="50px">Why Become a Mentor?</Heading></Center>
            <Box display="flex"  justifyContent="center">
                <Box display={{base: "block", lg: "flex"}}  justifyContent="center" alignItems="center" m="40px" mt="0px" p="20px" bg="brand.700" boxShadow={"xl"} rounded="2xl" maxW="1500px">
                    <Card m="20px"minH="250px" w={{lg: "33%"}} >
                        <CardBody display={{base: "block", sm: "flex"}} alignItems="center" m="10px">
                            <Image maxW={{sm: "45%"}} h="auto" src="/img/mirror.png" m="10px"/>
                            <Box w={{sm: "55%"}}>
                                <Heading mb={4} fontSize={"xl"}>Impactful</Heading>
                                <Text>Inspire and empower students to achieve their language learning goals through personalized guidance and support.</Text>
                            </Box>
                            
                        </CardBody>
                    </Card>
                    <Card maxW="800px" m="20px" minH="250px" w={{lg: "33%"}}>
                        <CardBody display={{base: "block", sm: "flex"}} alignItems="center" m="10px">
                            <Image w={{sm:"50%"}} h="auto" src="/img/computer.png" m="10px"/>
                            <Box w={{sm:"50%"}}>
                                <Heading mb={4} fontSize={"xl"}>Flexible</Heading>
                                <Text>Set your own schedule and availability, allowing you to mentor students at times that work best for you.</Text>
                            </Box>
                        </CardBody>
                    </Card>
                    <Card maxW="800px" m="20px" minH="250px" w={{lg: "33%"}}>
                        <CardBody display={{base: "block", sm: "flex"}} alignItems="center" m="10px">
                            <Image maxW={{sm: "45%"}} h="auto" src="/img/swim.png" m="10px"/>
                            <Box w={{sm: "55%"}}>
                                <Heading mb={4} fontSize={"xl"}>Rewarding</Heading>
                                <Text>Experience the satisfaction of seeing your students grow and succeed, knowing that you played a crucial role in their language learning journey.</Text>
                            </Box>
                          
                        </CardBody>
                    </Card>
                </Box>
            </Box>
    </Box>
}