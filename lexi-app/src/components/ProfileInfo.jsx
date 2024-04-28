import { Box, Heading, Divider, Input, FormLabel, Avatar, Spacer, RadioGroup, Radio, Stack, Flex, Button } from '@chakra-ui/react'

export default function ProfileInfo() {
    return <Box m="30px" mt="0px">
        <Heading fontSize="xl" mb={4}>Personal Information</Heading>
        <Divider orientation='horizontal' mb={4}/>
        <Box>
            <Box  display="flex" gap={10}>
                    <Box  w="70%">
                        <FormLabel>Profile picture</FormLabel>
                        <Input type="file"></Input>
                        <FormLabel>First name</FormLabel>
                        <Input></Input>
                        <FormLabel>Last name</FormLabel>
                        <Input></Input>
                    </Box>
                    <Spacer></Spacer>
                    <Avatar size="2xl" src=""></Avatar>
            </Box>
            <Divider orientation='horizontal' mt={7} mb={5}/>
            <Box w="70%">
                <FormLabel>Country</FormLabel>
                <Input></Input>
                <FormLabel>Nationality</FormLabel>
                <Input></Input>
            </Box>
            <Divider orientation='horizontal' mt={7} mb={5}/>
            <RadioGroup mb="30px" name="proficiency">
                <FormLabel>Level</FormLabel>
                <Stack>
                    <Radio mr={1} value='0'>0 - No proficiency</Radio>
                    <Radio mr={1} value='1'>1 - Low proficiency</Radio>
                    <Radio mr={1} value='2'>2 - Intermediate proficiency</Radio>
                    <Radio mr={1} value='3'>3 - Upper Intermediate proficiency</Radio>
                    <Radio mr={1} value='4'>4 - High proficiency</Radio>
                </Stack>
            </RadioGroup>
            <Flex justify="flex-end">
                <Button className="right-aligned" colorScheme="teal">Save</Button>
            </Flex>
        </Box>
    </Box>
}