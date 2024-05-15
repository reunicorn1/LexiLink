import { Heading, Text, Grid, GridItem, Image, Button, Box } from '@chakra-ui/react'
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Link } from 'react-router-dom'

export default function Banner () {
    return (
        <Box display="flex" justifyContent="center" >
            <Grid  templateColumns="1fr 1fr" gap={6} m="60px" color="black" justifyContent="center" alignItems="center" maxW="1250px">
                <GridItem colSpan={{base: 2, lg: 1}}  gap={2}>
                    <Heading mb={4} as='h3' size='3xl'>
                        Welcome to LexiLink
                    </Heading>
                    <Text fontSize='xl' w="auto">
                    Unlock the door to fluent English with LexiLink, your gateway to tailored language mastery through personalized mentorship sessions. 
                    </Text>
                    <Link to="/browse">
                    <Button rightIcon={<ArrowForwardIcon />} colorScheme='faceboo' bg='brand.800' mt='24px' w="60%" h="50px;" borderRadius="lg" >
                        Get Started
                    </Button>
                    </Link>
                </GridItem>
                <GridItem colSpan={{base: 2, lg: 1}} >
                    <Image src="/img/banner.png" alt="Banner-Cover" boxSize="auto" width="auto" height="auto"/>
                </GridItem>
            </Grid> 
        </Box>
    );
}