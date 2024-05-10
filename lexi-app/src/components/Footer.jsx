import { Box, Flex, Icon, Text, Heading, Spacer } from '@chakra-ui/react'
import { FaFacebook } from "react-icons/fa";
import { RiTwitterXFill, RiInstagramFill } from "react-icons/ri";
import { FaGithub } from "react-icons/fa6";
import { Link } from 'react-router-dom';


export default function Footer () {
    return(
        <Box bg="brand.800" color="white" pt="10" pb="5" textAlign="center">
            <Flex justifyContent="center" gap={4} m="10px">
                <Icon boxSize="25px" as={FaFacebook}/>
                <Icon boxSize="25px" as={RiTwitterXFill}/>
                <Icon boxSize="25px" as={RiInstagramFill}/>
                <Icon boxSize="25px" as={FaGithub}/>
            </Flex>
            <Flex m="60px" mb="0px" mt="10px">
                <Text>© .LEXILINK INC 2024</Text>
                <Spacer />
                <Flex gap={6}>
                    <Link to="/"><Heading fontSize="md">Home</Heading></Link>
                    <Link to="/about"><Heading fontSize="md">About</Heading></Link>
                    <Link to="/mentor"><Heading fontSize="md">Join Us</Heading></Link>
                    <Link to="/browse"><Heading fontSize="md">Browse a Tutor</Heading></Link>
                </Flex>
            </Flex>
        </Box>
    );
}
