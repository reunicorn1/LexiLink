import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Flex,
    Spacer,
    Avatar,
    Box,
    Text,
    Heading,
    Button,
    Divider,
    useToast
  } from '@chakra-ui/react'

import { useRef, useState, useEffect } from 'react';
import { useUpdate } from '../pages/MentorDashboard';
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useWithRefresh } from '../utils/useWithRefresh';
import axios from 'axios';
import { API_URL } from '../utils/config';

const statusColors = {
    "Pending": undefined,
    "Completed": "green",
    "Cancelled": "red",
    "Approved": "purple"
};

function UpdateOptions ({status, setStatus, session}) {
    useEffect(() => {
        setStatus(session.status);
    }, [])
    
    // Add this to MenuButton is it's not there: isDisabled={status === "Completed"}
    return <Menu>
    <MenuButton  as={Button} colorScheme={statusColors[status]}size="sm" rightIcon={<ChevronDownIcon />}>
        {status}
    </MenuButton>
    <MenuList>
      <MenuItem onClick={()=>setStatus("Cancelled")}>Cancelled</MenuItem>
      <MenuItem onClick={()=>setStatus("Completed")}>Completed</MenuItem>
      <MenuItem onClick={()=>setStatus("Pending")}>Pending</MenuItem>
    </MenuList>
  </Menu>
}


export default function UpdateModal({isOpen, onClose, session}) {  
    const toast = useToast()
    const [executor, { isLoading, isSuccess, isRefreshing }] = useWithRefresh({ isImmediate: false });
    const [status, setStatus] = useState();
    const {setUpdate, update} = useUpdate();
    

    const cleanup = () => {
        setStatus(session.status);
        onClose();
    }

    const followup = () => {
        onClose();
        setUpdate(!update);
        toast({
            title: 'Session Status Updated Successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
    }

    const handleSave = async() => {
        await executor(
            (token) => axios.put(`${API_URL}/sessions/${session.id}`, {status: status}, { headers: { Authorization: "Bearer " + token } }),
            (result) => followup()
        );
    }
  
    return (
      <>  
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          closeOnOverlayClick={false} 
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Session Status</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
            <Flex alignItems={'center'} mr={4}>
                <Avatar size="md" src={session?.student_dp}></Avatar>
                <Box ml="15px">
                    <Heading fontSize={'md'}>{session?.student_name}</Heading>
                    <Text fontSize={'xs'}>{session?.student_email}</Text>
                </Box>
                <Spacer/>
                <UpdateOptions status={status} setStatus={setStatus} session={session}/>
            </Flex>
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button colorScheme='orange' mr={3} onClick={handleSave}>
                Save
              </Button>
              <Button onClick={cleanup}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }