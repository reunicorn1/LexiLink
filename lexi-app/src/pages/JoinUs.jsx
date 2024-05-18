import { Box, Heading, Text, Image, useBreakpointValue, Tag, Center, Button, Card, CardHeader, CardBody, CardFooter, SimpleGrid, Grid } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from '../AuthContext';
import useAxiosPrivate from "../utils/useAxiosPrivate";
import axios from "axios";

export default function JoinUs () {
    const executor = useAxiosPrivate();
    const navigate = useNavigate();
    const { logout, role, refreshToken } = useAuth();
    const isLargeScreen = useBreakpointValue({ base: false, lg: true });
    const img = <Image m="30px"src="/img/mentor.png" maxW={{base: "80%", lg: "40%"}} height="auto"></Image>


    const afterlogout = () => {
        logout();
        navigate('/')
      }
    
      const handleLogOut = async () => {
        try {
            const response = await executor.delete(`/auth/logout`, {data: {refresh_token: refreshToken}});
            afterlogout();
        } catch (err) {
            console.error(err);
        }
      }
    
      useEffect(() => {
        if (role === "student") {
          handleLogOut();
        }
      }, [])
      

    return <Box>
            <Box display="flex"  justifyContent="center" bg="brand.100" color="white">
                <Box display={{base: "block", md: "flex"}} p="60px" pb="5px" pt="10px" maxW="1250px" alignItems="center" >
                        {isLargeScreen ? img : <Center>{img}</Center>}  
                        <Box p="20px" m="10px">
                            <Tag size={'md'} mb={4} variant="outline" color="white" textDecoration="none" borderWidth={2}><Text as="b">Tutor anytime, anywhere</Text></Tag>
                            <Heading fontSize="4xl" mb={4}>Become a LexiLink Mentor</Heading>
                            <Text fontSize="xl">Are you passionate about helping others learn English and eager to share your knowledge and expertise? Join our community of mentors at LexiLink and make a difference in the lives of language learners around the world.</Text>
                            <Button size="lg" mt="30px" onClick={() => navigate("/mentor/sign-up")}>Get Started Now</Button>
                        </Box>
                    </Box>
            </Box>
            <Center><Heading fontSize="3xl" m="30px"  mt="50px">Why Become a Mentor?</Heading></Center>
            <Box
            maxW="1300px"
            mx="auto"
            mb="50px"
            p="40px"
            bg="brand.700"
            boxShadow="xl"
            rounded="2xl"
            >
                <Grid
                    templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
                    gap={9}
                    justifyItems="center"
                >
                    <Card
                    minH="280px"
                    w={{ lg: 'full' }}
                    p={4}
                    bg="white"
                    boxShadow="md"
                    rounded="lg"
                    >
                    <CardBody display="flex" flexDirection="column" alignItems="center">
                        <Image
                        src="/img/mirror.png"
                        alt="Mirror"
                        objectFit="cover"
                        h={150}
                        w={"auto"}
                        mb={4}
                        />
                        <Box>
                        <Heading fontSize="xl" mb={2}>
                            Impactful
                        </Heading>
                        <Text fontSize="md">
                            Inspire and empower students to achieve their language learning goals
                            through personalized guidance and support.
                        </Text>
                        </Box>
                    </CardBody>
                    </Card>
                    <Card
                    minH="280px"
                    w={{ lg: 'full' }}
                    p={4}
                    bg="white"
                    boxShadow="md"
                    rounded="lg"
                    >
                    <CardBody display="flex" flexDirection="column" alignItems="center">
                        <Image
                        src="/img/computer.png"
                        alt="Computer"
                        objectFit="cover"
                        h={165}
                        w={"auto"}
                        mb={4}
                        />
                        <Box>
                        <Heading fontSize="xl" mb={2}>
                            Flexible
                        </Heading>
                        <Text fontSize="md">
                            Set your own schedule and availability, allowing you to mentor
                            students at times that work best for you.
                        </Text>
                        </Box>
                    </CardBody>
                    </Card>
                    <Card
                    minH="280px"
                    w={{ lg: 'full' }}
                    p={4}
                    bg="white"
                    boxShadow="md"
                    rounded="lg"
                    >
                    <CardBody display="flex" flexDirection="column" alignItems="center">
                        <Image
                        src="/img/reward.png"
                        alt="Reward"
                        h={"150"}
                        w={"auto"}
                        mb={4}
                        />
                        <Box>
                        <Heading fontSize="xl" mb={2}>
                            Rewarding
                        </Heading>
                        <Text fontSize="md">
                            Experience the satisfaction of seeing your students grow and succeed,
                            knowing that you played a crucial role in their language learning
                            journey.
                        </Text>
                        </Box>
                    </CardBody>
                    </Card>
                </Grid>
            </Box>
    </Box>
}