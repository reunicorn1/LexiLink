import { Box, Flex, Image, Heading, Text, useBreakpointValue } from "@chakra-ui/react"
import { SmallCloseIcon} from '@chakra-ui/icons'

export default function Favorites() {
    const isLargeScreen = useBreakpointValue({ base: false, xl: true });

    return <>
        <Box display={{base:"block",  sm:"flex", xl:"block"}} gap={3}>
            {/* For every favorite assigned in the student entity run a for loop inside every card 
                Don't forget that every box is also clickable which goes to the mentor's profile
                display three max  
            
            */}
            <Box display="flex" bg="brand.800" color="white" rounded="2xl" m="10px" p={2} boxShadow="lg">
                <Flex alignItems="center" justifyContent="space-between" flex="1">
                    <Flex alignItems="center">
                        <Image rounded="full" boxSize="40px" src="/img/unicorn.png" />
                        <Box ml="15px">
                            <Heading fontSize="sm">Name of Mentor</Heading>
                            <Text fontSize="xs">Community Mentor</Text>
                        </Box>
                    </Flex>
                    <SmallCloseIcon ml="3" /> {/* Clicking the minus removes the mentor from favorites */}
                </Flex>
            </Box>
            <Box display="flex" bg="brand.700" color="white" rounded="2xl" m="10px" p={2} boxShadow="lg">
                <Flex alignItems="center" justifyContent="space-between" flex="1">
                    <Flex alignItems="center">
                        <Image rounded="full" boxSize="40px" src="/img/unicorn.png" />
                        <Box ml="15px">
                            <Heading fontSize="sm">Name of Mentor</Heading>
                            <Text fontSize="xs">Community Mentor</Text>
                        </Box>
                    </Flex>
                    <SmallCloseIcon ml="3" /> {/* Clicking the minus removes the mentor from favorites */}
                </Flex>
            </Box>
            <Box display="flex" bg="brand.600" color="white" rounded="2xl" m="10px" p={2} boxShadow="lg">
                <Flex alignItems="center" justifyContent="space-between" flex="1">
                    <Flex alignItems="center">
                        <Image rounded="full" boxSize="40px" src="/img/unicorn.png" />
                        <Box ml="15px">
                            <Heading fontSize="sm">Name of Mentor</Heading>
                            <Text fontSize="xs">Community Mentor</Text>
                        </Box>
                    </Flex>
                    <SmallCloseIcon ml="3" /> {/* Clicking the minus removes the mentor from favorites */}
                </Flex>
            </Box>
        </Box>
    </>
}