import { 
    Box, 
    Text, 
    Divider, 
    Button, 
    Heading, 
    useDisclosure, 
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay
} from "@chakra-ui/react";
import { useRef } from "react";
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext';
import useAxiosPrivate from "../utils/useAxiosPrivate";
import axios from "axios";




export default function Account({isLoading, setIsLoading}) {
    const executor = useAxiosPrivate(isLoading, setIsLoading);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef()
    const { authToken, refreshToken, logout, role } = useAuth();
    const navigate = useNavigate();
    //const [executor, { isLoading, isSuccess, isRefreshing }] = useWithRefresh({ isImmediate: false });

    const deleteAccount = (async () => {
      try {
        const response = await executor.delete(`/${role}/profile`);
        onClose();
        logout();
        navigate('/');
      } catch (err) {
        console.error(err);
      }
    })

    return <Box  m="30px" mt="0px">
            <Heading fontSize="xl" mb={4}>Delete account</Heading>
            <Divider orientation='horizontal' mb={4}/>
            <Text>Account deletion is permanent. Please confirm your decision.</Text>
            <Button mt={2} colorScheme='red' variant='outline' onClick={onOpen}>Delete your account</Button>

            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
            >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete your account
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={deleteAccount} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
}