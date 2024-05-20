import { Box, Flex, Avatar, Text, Heading, IconButton, Spacer, Modal, Button,ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Divider, Input, Textarea, useToast } from "@chakra-ui/react"
import { EmailIcon } from '@chakra-ui/icons'
import { useEffect, useState } from "react";
import useAxiosPrivate from "../utils/useAxiosPrivate";
import { useAuth } from "../AuthContext";
import axios from 'axios';
import { API_URL } from '../utils/config';

function SendEmail ({isOpen, onClose, student, isLoading, setIsLoading}){
  const toast = useToast();
  const {user} = useAuth();
  const executor = useAxiosPrivate(isLoading, setIsLoading);
  const [email, setEmail] = useState({subject: "", message: ""});


  const handleInputChange = (e) => {
    const { name, value } = e.currentTarget;
    setEmail({ ...email, [name]: value });
}

const handleSend = async() => {
  try {
    await executor.post("/mentor/email_student", {...email, receiver: student.email, sender: user.email})
    toast({
      title: `Email was sent successfully to ${student.first_name}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  } catch(err) {
    console.log(err);
  }
}

  return <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Contact Student</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Heading mb={2} fontSize="sm">Name</Heading>
          <Text>{student?.first_name} {student?.last_name}</Text>
          <Divider mb={4}/>

          <Heading fontSize="sm">Subject</Heading>
          <Input variant='flushed' name="subject" value={email.subject} onChange={handleInputChange}></Input>
          <Divider mb={4}/>

          <Heading fontSize="sm">Message</Heading>
          <Textarea variant='flushed' name="message" value={email.message} onChange={handleInputChange}></Textarea>
          <Divider mb={4}/>

        </ModalBody>
        <ModalFooter>
          <Button colorScheme='orange' mr={3}
          isDisabled={!Object.values(email).every((value)=>value)}
          onClick={handleSend}
          >
            Send
          </Button>
          <Button variant='ghost' onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
}

export default function Students({ isLoading, setIsLoading }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const executor = useAxiosPrivate(isLoading, setIsLoading);
  const [students, setStudents] = useState();
  const [studentClicked, setStudentClicked] = useState();

  useEffect(()=>{
    const gettingStudents = async () => {
      try {
        const response = await executor.get(`/mentor/students/`);
        setStudents(response.data.students)
      } catch (err) {
        console.error(err);
      }
    };
    gettingStudents();
  }, [])

  const handleClick = (student) => {
    setStudentClicked(student);
    onOpen();
  }

  
  return (
    <>
    {(Array.isArray(students) && students.length) ? 
        <Box display="block">
          <Heading m="10px" mt={0} fontSize={"xl"}>Students</Heading>
          <Box display={{ base: "block", sm: "flex", xl: "block" }} gap={3} height={{ xl: "43vh" }} overflowY="auto">
                {/* the relationship of boxes to each other */}
                  {students?.map((item ,index) => (
                  <Flex key={index} bg="brand.800" color="white" rounded="2xl" m="10px" p={3} boxShadow="lg">
                     <Flex alignItems="center" justifyContent="space-between" flex="1">
                      <Flex alignItems="center">
                        <Avatar size="md" src={item.profile_picture} />
                        <Box ml="15px">
                          <Heading fontSize="md">{item.first_name} {item.last_name}</Heading>
                        </Box>   
                      </Flex>
                      <Spacer/>
                        <IconButton
                        isRound={true}
                        variant='solid'
                        aria-label='Done'
                        fontSize='15px'
                        size="xs"
                        ml="5" 
                        icon={<EmailIcon />}
                        onClick={()=>handleClick(item)}
                        />
                    </Flex>
                  </Flex>
                  ))}
              </Box>
          </Box> : null
        }
        <SendEmail isOpen={isOpen} onClose={onClose} student={studentClicked} isLoading={isLoading} setIsLoading={setIsLoading}/>
    </>
  );
}