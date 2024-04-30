import { Box, Card, CardBody, Heading, Avatar, Text, Button, Spacer, Divider, useBreakpointValue, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Badge, Tag, Flex } from '@chakra-ui/react'
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { Icon } from '@chakra-ui/react'
import { useState } from 'react';

export default function BrowsingSection () {
    const isLargeScreen = useBreakpointValue({ base: false, md: true });
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(!isClicked);
      };

    return <Box display="flex" justifyContent="center">
    <Box maxW="1250px" display="flex" justifyContent="center" overflowY="auto">
        {/* scrollable section */}
        <Box m="20px" mr="10px" mt="0px" w="90%" overflowY="auto" height="150vh">
            <Card borderWidth={1} borderColor={isClicked ? "brand.700" : "grey"} m="8px" p="10px" style={{ cursor: "pointer" }} onClick={handleClick}>
                <CardBody>
                    <Box display={{base:"block", sm: "flex"}} alignItems="center" textAlign={{base: "center", sm:"left"}} overflow="hidden" whiteSpace="wrap" textOverflow="ellipsis">
                        <Avatar m="10px" mb={3} size={{base: "xl", lg:"2xl"}} src="https://via.placeholder.com/150" />
                        <Box m="10px">
                            <Heading size='md'>John Doe</Heading>
                            <Badge colorScheme='green'>Professinal Mentor</Badge>
                            <Text>Languages: <span className='first'>Arabic</span></Text>
                            <Text mt={2}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec fringilla justo.</Text>
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="flex-end" m="10px" mt="10px" mb="0px">
                        <Heading color="brand.800" size="md">USD 20.00</Heading>
                    </Box>
                </CardBody>
            </Card>
            <Card borderWidth={1} borderColor={isClicked ? "brand.700" : "grey"} m="8px" p="10px" style={{ cursor: "pointer" }} onClick={handleClick}>
                <CardBody>
                    <Box display={{base:"block", sm: "flex"}} alignItems="center" textAlign={{base: "center", sm:"left"}} overflow="hidden" whiteSpace="wrap" textOverflow="ellipsis">
                        <Avatar m="10px" mb={3} size={{base: "xl", lg:"2xl"}} src="https://via.placeholder.com/150" />
                        <Box m="10px">
                            <Heading size='md'>John Doe</Heading>
                            <Badge colorScheme='green'>Professinal Mentor</Badge>
                            <Text>Languages: <span className='first'>Arabic</span></Text>
                            <Text mt={2}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec fringilla justo.</Text>
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="flex-end" m="10px" mt="10px" mb="0px">
                        <Heading color="brand.800" size="md">USD 20.00</Heading>
                    </Box>
                </CardBody>
            </Card>
            <Card borderWidth={1} borderColor={isClicked ? "brand.700" : "grey"} m="8px" p="10px" style={{ cursor: "pointer" }} onClick={handleClick}>
                <CardBody>
                    <Box display={{base:"block", sm: "flex"}} alignItems="center" textAlign={{base: "center", sm:"left"}} overflow="hidden" whiteSpace="wrap" textOverflow="ellipsis">
                        <Avatar m="10px" mb={3} size={{base: "xl", lg:"2xl"}} src="https://via.placeholder.com/150" />
                        <Box m="10px">
                            <Heading size='md'>John Doe</Heading>
                            <Badge colorScheme='green'>Professinal Mentor</Badge>
                            <Text>Languages: <span className='first'>Arabic</span></Text>
                            <Text mt={2}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec fringilla justo.</Text>
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="flex-end" m="10px" mt="10px" mb="0px">
                        <Heading color="brand.800" size="md">USD 20.00</Heading>
                    </Box>
                </CardBody>
            </Card>
            <Card borderWidth={1} borderColor={isClicked ? "brand.700" : "grey"} m="8px" p="10px" style={{ cursor: "pointer" }} onClick={handleClick}>
                <CardBody>
                    <Box display={{base:"block", sm: "flex"}} alignItems="center" textAlign={{base: "center", sm:"left"}} overflow="hidden" whiteSpace="wrap" textOverflow="ellipsis">
                        <Avatar m="10px" mb={3} size={{base: "xl", lg:"2xl"}} src="https://via.placeholder.com/150" />
                        <Box m="10px">
                            <Heading size='md'>John Doe</Heading>
                            <Badge colorScheme='green'>Professinal Mentor</Badge>
                            <Text>Languages: <span className='first'>Arabic</span></Text>
                            <Text mt={2}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec fringilla justo.</Text>
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="flex-end" m="10px" mt="10px" mb="0px">
                        <Heading color="brand.800" size="md">USD 20.00</Heading>
                    </Box>
                </CardBody>
            </Card>
            <Card borderWidth={1} borderColor={isClicked ? "brand.700" : "grey"} m="8px" p="10px" style={{ cursor: "pointer" }} onClick={handleClick}>
                <CardBody>
                    <Box display={{base:"block", sm: "flex"}} alignItems="center" textAlign={{base: "center", sm:"left"}} overflow="hidden" whiteSpace="wrap" textOverflow="ellipsis">
                        <Avatar m="10px" mb={3} size={{base: "xl", lg:"2xl"}} src="https://via.placeholder.com/150" />
                        <Box m="10px">
                            <Heading size='md'>John Doe</Heading>
                            <Badge colorScheme='green'>Professinal Mentor</Badge>
                            <Text>Languages: <span className='first'>Arabic</span></Text>
                            <Text mt={2}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec fringilla justo.</Text>
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="flex-end" m="10px" mt="10px" mb="0px">
                        <Heading color="brand.800" size="md">USD 20.00</Heading>
                    </Box>
                </CardBody>
            </Card>
        </Box>
        {/* fixed section */}
        { isLargeScreen && 

        <Box m="20px" ml="10px"mt="0px" w="100%"  height="150vh" overflowY="auto" top="0" >
            <Card m="8px" >
                <CardBody>
                    <Box display="flex" justifyContent="center" textAlign="center">
                        <Box>
                            <Avatar m="20px" size="2xl" src="/img/unicorn.png"></Avatar>
                            <Heading fontSize="3xl">John Doe</Heading>
                            <Badge colorScheme='green'>Professinal Mentor</Badge>
                        </Box>
                    </Box>
                    <Box m="20px">
                        <Heading mb={2} fontSize="lg">Languages</Heading>
                        <Flex mb={4} gap={2}>
                            <Tag>Spanish</Tag>
                            <Tag>French</Tag>
                            <Tag>Arabic</Tag>
                        </Flex>
                        <Heading mb={1} fontSize="lg">Bio</Heading>
                        <Text mb={4}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec fringilla justo</Text>
                        <Heading mb={1} fontSize="lg">Expertise</Heading>
                        <Text mb={4}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                tempor incididunt ut labore et dolore magna aliqua.</Text>
                        <Divider orientation='horizontal' mb={6}/>
                        <iframe width="100%" height="315"
                        src="https://www.youtube.com/embed/tgbNymZ7vqY">
                        </iframe>
                        <Accordion mt={4} allowToggle>
                            <AccordionItem>
                                <h2>
                                <AccordionButton>
                                    <Box as='span' flex='1' textAlign='left'>
                                    Read More
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                commodo consequat.
                                </AccordionPanel>
                            </AccordionItem>
                            </Accordion>
                            <Box display="flex" alignItems="center" m="20px">
                                <Button colorScheme="teal" w="80%">Book Now</Button>
                                <Spacer></Spacer>
                                <Icon boxSize="30px" as={IoMdHeartEmpty} />
                            </Box>
                    </Box>
                </CardBody>
            </Card>
        </Box>
        }
    </Box>
</Box>
}