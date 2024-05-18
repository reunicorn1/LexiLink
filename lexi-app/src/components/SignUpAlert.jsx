import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Image,
    Heading,
    Text,
    Button
  } from '@chakra-ui/react'
  import { useNavigate } from 'react-router-dom'

  export default function SignUpAlert ({isOpen, onClose}) {
    const navigate = useNavigate();

    return (
        <>
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalCloseButton />
                <ModalBody textAlign="center">
                  <Image src="/img/horse.gif"></Image>
                  <Heading color="brand.800" mb={2} fontSize={'3xl'}>Enroll for Access to Exceptional Mentors!</Heading>
                  <Text fontSize="lg">Unlock access to mentors by registering today</Text>
                </ModalBody>

                <ModalFooter mb="20px">
                  <Button w="100%" colorScheme='facebook' mr={3} onClick={() => navigate('/sign-up')}>
                    Sign Up
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        )
  }