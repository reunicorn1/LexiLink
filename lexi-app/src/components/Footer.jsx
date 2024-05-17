import { Box, Flex, Icon, Text, Heading, Spacer, Center } from '@chakra-ui/react'
import { FaLinkedin } from "react-icons/fa";
import { RiTwitterXFill, RiInstagramFill } from "react-icons/ri";

import { FaGithub } from "react-icons/fa6";
import { Link } from 'react-router-dom';


export default function Footer () {
    return(
        <Box bg="brand.800" color="white" pt="10" pb="5" textAlign="center">
            <Flex justifyContent="center" gap={4} m="10px">
                <Icon boxSize="25px" as={FaLinkedin}/>
                <Link to="https://github.com/reunicorn1/LexiLink"><Icon boxSize="25px" as={FaGithub}/></Link>
                <Icon boxSize="25px" as={RiTwitterXFill}/>
            </Flex>
            <Box display={{ md: "flex"}} m="60px" mb="0px" mt="10px">
                <Text mt={4}>© .LEXILINK INC 2024</Text>
                <Spacer />
                <Center mt={4}>
                    <Flex gap={6}>
                        <Link to="/"><Heading fontSize="md">Home</Heading></Link>
                        <Link to="/about"><Heading fontSize="md">About</Heading></Link>
                        <Link to="/mentor"><Heading fontSize="md">Mentor Portal</Heading></Link>
                        <Link to="/browse"><Heading fontSize="md">Browse a Tutor</Heading></Link>
                    </Flex>
                </Center>
                
            </Box>
        </Box>
    );
}
