import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalFooter,
    Button,
    Text,
    Image,
    Heading,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

export default function Success({isOpen, link}) {

    const navigate = useNavigate();

    // useEffect(() => {
    //     if (isOpen){
    //         setTimeout(() => {
    //             navigate(link);
    //         }, 4000)
    //     }
    // }, [isOpen])

    return <>
        <Modal closeOnOverlayClick={false} isOpen={isOpen}>
        <ModalOverlay />
              <ModalContent>
                <ModalBody textAlign="center">
                  <Image src="/img/tv.gif"></Image>
                  <Heading color="brand.800" mb={2} fontSize={'3xl'}>Congratulations!</Heading>
                  <Text fontSize="lg">Welcome to our community. Check your email to verify your account before logging in</Text>
                  <Text> </Text>
                </ModalBody>
                <ModalFooter mb="20px">
                  <Button w="100%" colorScheme='facebook' mr={3} onClick={() => navigate(link)}>
                    Go Login!
                  </Button>
                </ModalFooter>
              </ModalContent>
        </Modal>
    </>
}