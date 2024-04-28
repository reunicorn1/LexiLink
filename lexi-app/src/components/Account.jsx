import { Box, Text, Divider, Button, Heading } from "@chakra-ui/react";

export default function Account() {
    return <Box  m="30px" mt="0px">
            <Heading fontSize="xl" mb={4}>Delete account</Heading>
            <Divider orientation='horizontal' mb={4}/>
            <Text>Account deletion is permanent. Please confirm your decision.</Text>
            <Button mt={2} colorScheme='red' variant='outline'>Delete your account</Button>
    </Box>
}