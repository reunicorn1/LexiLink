import { Heading, Button, Image, Box, Text, useBreakpointValue } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export default function FinalBanner () {
    const isSmallScreen = useBreakpointValue({ base: true, md: false });

    return ( 
        <Box pos="relative">
            <Image src="/img/hands-5.png" alt="Your Image" w="100%" h="auto" />
            <Box color='white' pos="absolute" top="50%" left="50%" transform="translate(-80%, -50%)" textAlign="left">
                <Heading fontSize={{base: '2xl', xl:'5xl'}} mb={4} >Join Our Community</Heading>
                {isSmallScreen ? null : <>
                    <Text maxW="1050px" fontSize={{base: 'l', xl:'xl'}}>Are you passionate about English language learning? Are you an experienced English tutor looking to make a meaningful impact? Join our vibrant community of learners and mentors on LexiLink.</Text>
                </>}
                <Link to='/join-us'>
                <Button color='white' bg='brand.700' mt='24px' w="200px" h="50px;" borderRadius="lg">
                        Become a Tutor
                </Button>
                </Link>
            </Box>
        </Box>
    );
};