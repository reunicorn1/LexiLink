import { Heading, Button, Image, Box, Text, Flex, useBreakpointValue } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export default function FinalBanner () {
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const isGreatlScreen = useBreakpointValue({ base: false, '2xl': true });

    return ( 
        <Box display="flex" alignItems="center" bg="#606161" justifyContent="center">
            <Box  h="100%" color="white"  >
                <Box pl="100px" pt="50px" pb="50px" maxW="1250px">
                    <Heading  mb={4} w="60%">Join Our Community</Heading>
                    <Text w={{base:"70%", '2xl':"80%"}}>Are you passionate about teacing English? Are you an experienced English tutor looking to make a meaningful impact? Join our vibrant community of mentors on LexiLink.</Text>
                    <Link to='/mentor'>
                        <Button color='white' bg='brand.700' mt='24px' w="200px" borderRadius="lg">
                            Become a Tutor
                        </Button>
                    </Link>
                </Box>
            </Box>
            {(!isSmallScreen && !isGreatlScreen )&& 
                <Image ml="20px" zIndex={3} src="/img/hand.png" alt="Adam hands" w="40%" h="auto" />
            }
        </Box>
    );
};
