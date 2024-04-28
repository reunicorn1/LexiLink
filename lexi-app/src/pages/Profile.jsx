import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, Heading, Avatar, Flex, Image, Text } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { MdOutlineMail, MdOutlineSettings } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import ProfileInfo from '../components/ProfileInfo';

export default function Profile() {
    return <Box display="flex" justifyContent="center" m="30px">
        <Box bg="white" rounded="xl" maxW="1000" width="100%">
            <Flex alignItems={'center'} m="35px">
                <Avatar size="md" src="/img/unicorn.png"></Avatar>
                <Box ml="15px">
                    <Heading fontSize={'xl'}>Reem Osama</Heading>
                    <Text fontSize={'sm'}>Your Profile</Text>
                </Box>
            </Flex>
            <Tabs orientation="vertical" colorScheme='teal'>
                <TabList alignItems="start" minW="200px">
                    <Tab>&nbsp;&nbsp;&nbsp;&nbsp;<Icon as={FaRegUser} />&nbsp;&nbsp;Profile</Tab>
                    <Tab>&nbsp;&nbsp;&nbsp;&nbsp;<Icon as={MdOutlineSettings} />&nbsp;&nbsp;Account</Tab>
                    <Tab>&nbsp;&nbsp;&nbsp;&nbsp;<Icon as={MdOutlineMail} />&nbsp;&nbsp;Email</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <ProfileInfo/>
                    </TabPanel>
                    <TabPanel>
                        <p>two!</p>
                    </TabPanel>
                    <TabPanel>
                        <p>three!</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    </Box>
}