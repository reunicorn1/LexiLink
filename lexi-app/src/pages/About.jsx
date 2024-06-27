import { Box, Center, Heading, Tag, Text, Image, useBreakpointValue, Flex, Icon } from "@chakra-ui/react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

/**
 * About component displaying information about LexiLink and its team.
 * @returns {JSX.Element} The About component
 */
export default function About() {

    const isSmallScreen = useBreakpointValue({ base: true, md: false });

    return (<>
        <Box display="flex" justifyContent="center">
            <Box>

                {/* About Us Section */}
                <Center>
                    <Box m="40px">
                        <Center>
                            <Box>
                                <Tag mt={4} size={'md'} variant="outline" colorScheme="orange" color="brand.700" textDecoration="none" borderWidth={2}><Text as="b">About us</Text></Tag>
                                <Heading fontSize={{base: "4xl", md: "5xl"}}>
                                    Hi! We're LexiLink.
                                </Heading>
                                <Text  fontSize={{base: "xl", md: "2xl"}} >
                                    A vibrant community built on the joy of language and connection.
                                </Text>
                            </Box>
                        </Center>
                        <Center mt="50px">
                            <Image maxW={{base: "100%", md: "50%"}} src="/img/hats.png"></Image>
                        </Center>
                    </Box>
                </Center>

                {/* How It Started Section */}
                <Box display="flex" justifyContent="center" position="relative" color="white" bg="brand.800" width="100%" pb="50px" pt="50px">
                    <Box textAlign="center" p="20px" position="relative">
                        {!isSmallScreen && <Image position="absolute" top="0" right="200" boxSize="50px" src="icon-3.png" />}
                        <Heading mb={4}>
                            How it started
                        </Heading>
                        <Center>
                            <Text mt="20px" w={{base: "80%", md:"50%"}}>
                                LexiLink started from a conversation with a teacher friend who envisioned a platform for personalized English learning. Inspired by this idea, <b><span className="names">Reem</span></b> and <b><span className="names">Mohamed Elfadil</span></b> joined forces to create a dynamic platform connecting learners with mentors. Drawing from their experiences, LexiLink evolved into a platform where individuals enhance their English skills through personalized mentorship, paving the way for a brighter future in language education.
                            </Text>
                        </Center>
                        {!isSmallScreen &&<Image position="absolute" bottom="0" left="100" boxSize="70px" src="/img/icon-b.png" />}
                    </Box>
                </Box >

                {/* Our Mission Section */}
                <Center>
                    <Box mt="50px" mb="50px" display={{md: "flex"}} justifyContent="center" maxW="1000px" gap={4}>
                        <Box flex={1} bg="brand.600" color="white" textAlign="center" pt="80px" pb="80px" position="relative" rounded="2xl" display="flex" justifyContent="center" alignItems="center">
                            <Box w="10px" h="10px" bg="white" rounded="full" position="absolute" top="5" left="5"></Box>
                            <Box w="10px" h="10px" bg="white" rounded="full" position="absolute" bottom="5" left="5"></Box>
                            <Box w="10px" h="10px" bg="white" rounded="full" position="absolute" top="5" right="5"></Box>
                            <Box w="10px" h="10px" bg="white" rounded="full" position="absolute" bottom="5" right="5"></Box>
                            <Box>
                                <Tag rounded="full" mb={3} bg="white" size="lg" color="brand.800" variant='solid' borderWidth={2}><Text as="b">OUR MISSION</Text></Tag>
                                <Center>
                                    <Text fontSize="2xl" w="70%">To revolutionize English learning through personalized mentorship, fostering accessible and engaging educational experiences globally.</Text>
                                </Center>
                            </Box>
                        </Box>
                        {!isSmallScreen && 
                            <Box flex={1}  bg="brand.700" textAlign="center" rounded="2xl">
                                <Center>
                                    <Image w="70%" src="/img/rocket.png"/>
                                </Center>
                            </Box>
                        }
                        </Box>
                </Center>

                {/* The Dream Team Section */}
                <Box bg="white" pb="50px" pt="50px">
                    <Center>
                        <Heading>The dream team</Heading>
                    </Center>
                    <Box justifyContent="center" position="relative"  w="100%" display="flex">

                        <Box maxW="1000px" display={{md: "flex"}} justifyContent="center">

                            {/* Team Member: Mohamed Elfadil Abdalla */}
                            <Center>
                                <Box m="30px" w="75%">
                                    <Center><Image  w="80%" src="/img/mo.png"/></Center>
                                    <Tag mb={2} size="sm" colorScheme="green">Backend Developer</Tag>
                                    <Heading mb={2} fontSize="2xl">Mohamed Elfadil Abdalla</Heading>
                                    <Text textAlign="justify">
                                        Mohamed's expertise is the driving force behind the inner workings of our platform. He's the architect who ensures that data flows seamlessly throughout, creating a robust and efficient system that operates smoothly, and providing a user-friendly experience for all learners and mentors. Additionally, Mohamed has implemented our integrated video call feature, simplifying connections between students and mentors.
                                    </Text>
                                    <Flex justifyContent="space-around" mt={3} boxShadow="base" justify="flex-end" w="40%" rounded="full" p="8px">
                                        <Link to="https://github.com/mo7amedElfadil"><Icon fontSize="25px" as={FaGithub}/></Link>
                                        <Link to="https://linkedin.com/in/mohamedelfadil/"><Icon fontSize="25px" as={FaLinkedin}/></Link>
                                        <a h="0px" href="mailto:mo7amedelfadil@gmail.com?subject=Business%20Inquiry&body=Dear%20Mohamed%20Elfadil%20Abdalla,%0D%0A%0D%0AI%20hope%20this%20message%20finds%20you%20well.%20I%20am%20interested%20in%20discussing%20a%20potential%20business%20opportunity%20with%20you.%20Could%20we%20schedule%20a%20meeting%20to%20talk%20in%20detail?%0D%0A%0D%0AThank%20you,%0D%0A[Your%20Name]">
                                            <Icon fontSize="26px" as={MdEmail} />
                                        </a>
                                    </Flex>
                                </Box>
                            </Center>
                           
                           {/* Team Member: Reem Osama */}
                            <Center>
                                <Box m="30px" w="75%">
                                    <Center><Image w="80%" src="/img/reem.png"/></Center>
                                    <Tag mb={2} size="sm"  colorScheme="pink">Frontend Developer</Tag>
                                    <Heading mb={2} fontSize="2xl">Reem Osama</Heading>
                                    <Text textAlign="justify">
                                        With a keen eye for detail and a passion for user experience, Reem has played a pivotal role in refining LexiLink's platform into a sleek and professional interface. Her dedication to simplicity and elegance has resulted in an intuitive design that enhances usability for learners and mentors alike. Moreover, her seamless integration of the frontend with the backend ensures a cohesive experience for every user interaction.
                                    </Text>
                                    <Flex justifyContent="space-around" mt={3} boxShadow="base" justify="flex-end" w="40%" rounded="full" p="8px">
                                        <Link to="https://github.com/reunicorn1"><Icon fontSize="25px" as={FaGithub}/></Link>
                                        <Link to="https://www.linkedin.com/in/reosama/"><Icon fontSize="25px" as={FaLinkedin}/></Link>
                                        <a h="0px" href="mailto:ireosama1@gmail.com?subject=Business%20Inquiry&body=Dear%20Reem%20Osama,%0D%0A%0D%0AI%20hope%20this%20message%20finds%20you%20well.%20I%20am%20interested%20in%20discussing%20a%20potential%20business%20opportunity%20with%20you.%20Could%20we%20schedule%20a%20meeting%20to%20talk%20in%20detail?%0D%0A%0D%0AThank%20you,%0D%0A[Your%20Name]">
                                            <Icon fontSize="26px" as={MdEmail} />
                                        </a>
                                    </Flex>
                                </Box>
                            </Center>  
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
        <Footer/>
    </>
    )
}