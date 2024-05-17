import { Box, Flex, Text, Heading, Center, Card, CardHeader, CardBody, CardFooter, SimpleGrid, Button, Icon } from "@chakra-ui/react"
import { FaStar, FaRegStar } from "react-icons/fa";

export default function Reviews(){
    return <Box display="flex" justifyContent="center">
        <Box m="60px">
            <Center>
                <Heading>
                    What our learners are saying
                </Heading>
            </Center>
            <Box>
            <SimpleGrid spacing={4} templateColumns={{base: 'repeat(1, 1fr)', md:'repeat(2, 1fr)'}} gap={4} maxW="900px" mt="60px" mb="0px">
                <Card>
                    <CardHeader>
                        <Flex>
                            <Icon fontSize="20px" color="brand.700" as={FaStar} />
                            <Icon fontSize="20px" color="brand.700" as={FaStar} />
                            <Icon fontSize="20px" color="brand.700" as={FaStar} />
                            <Icon fontSize="20px" color="brand.700" as={FaStar} />
                            <Icon fontSize="20px" color="brand.700" as={FaRegStar} />
                        </Flex>
                    </CardHeader>
                    <CardBody>
                    <Heading fontSize="3xl" mb={3}>A game-changer</Heading>
                    <Text as="i">
                    "Lexi Link has been a game-changer for me. As a busy professional, I struggled to find time for language classes. With Lexi Link, I can easily schedule sessions with my favorite mentors at my convenience.Highly recommend!"
                    </Text>
                    </CardBody>
                    <CardFooter>
                        <Box>
                            <Heading color="brand.700" fontSize="lg">Jane Doe</Heading>
                            <Text>@jennie87</Text>
                        </Box>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <Flex>
                            <Icon fontSize="20px" color="brand.700" as={FaStar} />
                            <Icon fontSize="20px" color="brand.700" as={FaStar} />
                            <Icon fontSize="20px" color="brand.700" as={FaStar} />
                            <Icon fontSize="20px" color="brand.700" as={FaStar} />
                            <Icon fontSize="20px" color="brand.700" as={FaStar} />
                        </Flex>
                    </CardHeader>
                    <CardBody>
                    <Heading fontSize="3xl" mb={3}>It feels personalized</Heading>
                    <Text as="i">
                    "I've been using Lexi Link for a few months now, and I'm incredibly impressed with the quality of mentors available. Each session feels personalized, and I've noticed significant improvement in my English skills. The platform's dashboard makes it easy to track my progress. 5 stars!"                    </Text>
                    </CardBody>
                    <CardFooter>
                        <Box>
                            <Heading color="brand.700" fontSize="lg">John Smith</Heading>
                            <Text>@jsmith_0</Text>
                        </Box>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <Flex>
                            <Icon fontSize="20px" color="brand.700" as={FaStar} />
                            <Icon fontSize="20px" color="brand.700" as={FaStar} />
                            <Icon fontSize="20px" color="brand.700" as={FaStar} />
                            <Icon fontSize="20px" color="brand.700" as={FaRegStar} />
                            <Icon fontSize="20px" color="brand.700" as={FaRegStar} />
                        </Flex>
                    </CardHeader>
                    <CardBody>
                    <Heading fontSize="3xl" mb={3}>Exceeded my expectations</Heading>
                    <Text as="i">
                    "Lexi Link exceeded my expectations. The variety of mentors to choose from is fantastic, and the scheduling process is straightforward. I love how everything I need for my English learning journey is in one place. Thanks to Lexi Link, I feel more confident speaking English."                    </Text>
                    </CardBody>
                    <CardFooter>
                        <Box>
                            <Heading color="brand.700" fontSize="lg">Emily Johnson</Heading>
                            <Text>@emm00
                            </Text>
                        </Box>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <Flex>
                            <Icon fontSize="20px" color="brand.700" as={FaStar} />
                            <Icon fontSize="20px" color="brand.700" as={FaStar} />
                            <Icon fontSize="20px" color="brand.700" as={FaStar} />
                            <Icon fontSize="20px" color="brand.700" as={FaStar} />
                            <Icon fontSize="20px" color="brand.700" as={FaRegStar} />
                        </Flex>
                    </CardHeader>
                    <CardBody>
                    <Heading fontSize="3xl" mb={3}>It stands out!!</Heading>
                    <Text as="i">
                    "I've tried other language learning platforms before, but Lexi Link stands out for its user-friendly interface and excellent mentorship. The mentors are knowledgeable and supportive, and I appreciate the flexibility to schedule sessions according to my availability."                    </Text>
                    </CardBody>
                    <CardFooter>
                        <Box>
                            <Heading color="brand.700" fontSize="lg">David Lee</Heading>
                            <Text>@lee_san90</Text>
                        </Box>
                    </CardFooter>
                </Card>
                </SimpleGrid>
            </Box>
        </Box>
       
    </Box>
}