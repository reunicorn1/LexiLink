import { Box, Heading, Text, Image } from "@chakra-ui/react"

export default function Video() {
    return (<Box display="flex" justifyContent="center" bg="brand.700" color="white">
        <Box display={{base: "block", md: "flex"}} p="60px" pb="5px" pt="10px" maxW="1250px" alignItems="center">
            <Image src="/img/video.png" maxW={{base: "80%", lg: "40%"}} height="auto"></Image>
            <Box maxW="500px">
                <Heading mb={2}>Video Conferencing</Heading>
                <Text>
                Experience seamless communication with our integrated video conferencing feature. Connect with your mentor in real-time, no matter where you are in the world. Our advanced technology ensures crystal-clear video and audio quality, allowing you to engage in productive and immersive learning sessions.
                </Text>
            </Box>
        </Box>
    </Box>)
}