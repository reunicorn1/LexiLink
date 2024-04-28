import { Box, Text, Divider, Button, Heading, Input, InputGroup, InputRightElement } from "@chakra-ui/react";

export default function Email() {
    return <Box  m="30px" mt="0px">
            <Heading fontSize="xl" mb={4}>Email preferences</Heading>
            <Divider orientation='horizontal' mb={4}/>
            <Text>Subscribe across the different marketing platforms we offer.</Text>
            <InputGroup size='md' w="80%">
                <Input
                    pr='4.5rem'
                    type="text"
                    isDisabled
                />
                <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm'>
                    manage
                    </Button>
                </InputRightElement>
            </InputGroup>
    </Box>
}