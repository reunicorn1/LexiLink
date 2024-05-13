import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, Heading, Avatar, Flex, Text, useBreakpointValue } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { MdOutlineMail, MdOutlineSettings, MdOutlineCalendarToday } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import ProfileInfo from '../components/ProfileInfo';
import Account from '../components/Account';
import Email from '../components/Email';
import { useAuth } from '../AuthContext';
import Availability from '../components/Availability';


export default function Profile() {
    const { user, role } = useAuth();
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const Smallestcreen = useBreakpointValue({ base: true, sm: false });

    return <Box display="flex" justifyContent="center" m="30px">
        <Box bg="white" rounded="xl" maxW="1000" width="100%">
            <Flex alignItems={'center'} m="35px">
                <Avatar size="md" src={user.profile_picture}></Avatar>
                <Box ml="15px">
                    <Heading fontSize={'xl'}>{user.first_name} {user.last_name}</Heading>
                    <Text fontSize={'sm'}>Your Profile</Text>
                </Box>
            </Flex>
            <Tabs orientation="vertical" colorScheme='teal'>
                <TabList alignItems="start" minW={{base: "30px", sm: "50px", md:"200px"}}>
                    {Smallestcreen ? <Tab>&nbsp;&nbsp;&nbsp;&nbsp;<Icon as={FaRegUser} /></Tab> : <Tab>&nbsp;&nbsp;&nbsp;&nbsp;<Icon as={FaRegUser} />&nbsp;&nbsp;Profile</Tab>}
                    {role === "mentor" && <>{Smallestcreen ? <Tab>&nbsp;&nbsp;&nbsp;&nbsp;<Icon as={MdOutlineCalendarToday} /></Tab> : <Tab>&nbsp;&nbsp;&nbsp;&nbsp;<Icon as={MdOutlineCalendarToday} />&nbsp;&nbsp;Availability</Tab>}</>}
                    {Smallestcreen ? <Tab>&nbsp;&nbsp;&nbsp;&nbsp;<Icon as={MdOutlineSettings} /></Tab> : <Tab>&nbsp;&nbsp;&nbsp;&nbsp;<Icon as={MdOutlineSettings} />&nbsp;&nbsp;Account</Tab>}
                    {Smallestcreen ? <Tab>&nbsp;&nbsp;&nbsp;&nbsp;<Icon as={MdOutlineMail} /></Tab> : <Tab>&nbsp;&nbsp;&nbsp;&nbsp;<Icon as={MdOutlineMail} />&nbsp;&nbsp;Email</Tab>}
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <ProfileInfo/>
                    </TabPanel>
                    <TabPanel>
                        <Availability/>
                    </TabPanel>
                    <TabPanel>
                        <Account />
                    </TabPanel>
                    <TabPanel>
                        <Email />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    </Box>
}