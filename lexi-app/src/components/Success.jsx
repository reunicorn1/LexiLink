import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Text,
    Image,
    Center,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function Success({isOpen}) {

    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen){
            setTimeout(() => {
                navigate("/sign-in");
            }, 2000)
        }
    }, [isOpen])

    return <>
        <Modal isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Congratulations!</ModalHeader>
                <ModalBody>
                    <Text fontSize="lg">Welcome to our community. Let the learning journey begin!</Text>
                    <br></br>
                    <Center><Image mt={4} boxSize="80%" src="/img/rocket.png"></Image></Center>
                    <Center><Text>You will be redirected to sign in to your account</Text></Center>
                </ModalBody>
                <ModalFooter />
            </ModalContent>
        </Modal>
    </>
}