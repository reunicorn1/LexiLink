import { Heading, Center, Card, CardHeader, CardBody, SimpleGrid, Text, Box, Image } from '@chakra-ui/react'

export default function SecondBanner () {
    return (
    <Box as="div" m="80px">
        <Center>
            <Heading fontSize="5xl">How It Works</Heading>
        </Center>
                <SimpleGrid gap={6} templateColumns={{md:'repeat(2, 1fr)',  xl:'repeat(4, minmax(200px, 1fr))'}} m="60px" >
                    <Card>
                        <CardHeader>
                            <Heading size='md'> Register</Heading>
                        </CardHeader>
                        <CardBody>
                            <Center mb={4}><Image src="/img/why-1.png" alt="Girl-Thinking" boxSize="auto" width="auto" height="150px"/></Center>
                            <Text> Create your account on LexiLink and set up your profile. Tell us about your language learning goals, preferences, and availability.</Text>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Heading size='md'> Explore Mentors</Heading>
                        </CardHeader>
                        <CardBody>
                            <Center mb={4}><Image src="/img/why-2.png" alt="Girl-Reading" boxSize="auto" width="auto" height="150px"/></Center>
                            <Text>Browse through our extensive list of mentors and discover the perfect match for your learning journey. Explore their profiles, including their areas of expertise, availability, and pricing.</Text>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Heading size='md'>Schedule Class</Heading>
                        </CardHeader>
                        <CardBody>
                            <Center mb={4}><Image src="/img/why-3.png" alt="Man-Clock" boxSize="auto" width="auto" height="150px"/></Center>
                            <Text>Select your preferred mentor and schedule your sessions based on their availability. With just a few clicks, you'll be on your way to unlocking your full linguistic potential.</Text>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Heading size='md'>Learn and Grow</Heading>
                        </CardHeader>
                        <CardBody>
                        <Center mb={4}><Image src="/img/why-4.png" alt="Boy Celebrating" boxSize="auto" width="auto" height="150px"/></Center>
                            <Text>Dive into your personalized mentorship sessions and watch your English skills flourish. Receive tailored guidance, constructive feedback, and expert insights that propel you towards fluency and confidence.</Text>
                        </CardBody>
                    </Card>
                </SimpleGrid>
        </Box>
    );
}