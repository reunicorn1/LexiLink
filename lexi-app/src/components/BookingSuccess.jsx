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
export default function BookingSuccess({ isOpen, onClose }) {
  const navigate = useNavigate();

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
              <ModalOverlay />
              <ModalContent>
                <ModalBody textAlign="center">
                  <Image  objectFit="cover"  h="350px"src="/img/rubik.gif"></Image>
                  <Heading color="brand.700" mb={2} fontSize={'3xl'}>And thats's it!</Heading>
                  <Text fontSize="lg">Your booking details will be sent to you over email, make sure to attend at time!</Text>
                </ModalBody>

                <ModalFooter mb="20px">
                  <Button w="100%" bg="brand.700" color="white" mr={3} onClick={() => navigate('/')}>
                    Take me home
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        )
  }