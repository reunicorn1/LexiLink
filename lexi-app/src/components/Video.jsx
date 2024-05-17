import { Box, Heading, Text, Image, Spacer } from "@chakra-ui/react"

export default function Video() {
    return (<Box display="flex" justifyContent="center" bg="brand.800" color="white">
        <Box display={{base: "block", md: "flex"}} p="60px" pb="30px" pt="30px" maxW="1250px" alignItems="center">
            <Image src="/img/video.png" maxW={{base: "80%", md: "40%"}} height="auto"></Image>
            <Spacer />
            <Box maxW="500px" m="50px">
                <Heading fontSize="4xl" mb={2}>Enhanced Learning Connectivity</Heading>
                <Text>
                    Experience unparalleled connectivity with our integrated video conferencing feature, designed to revolutionize your learning journey. Our cutting-edge technology guarantees crystal-clear video and audio quality, ensuring every learning session is immersive and productive.
                </Text>
            </Box>
        </Box>
    </Box>)
}