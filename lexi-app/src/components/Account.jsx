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
import axios from "axios";
import { useWithRefresh } from '../utils/useWithRefresh';
import { API_URL } from '../utils/config';



export default function Account() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef()
    const { authToken, logout } = useAuth();
    const navigate = useNavigate();
    const [executor, { isLoading, isSuccess, isRefreshing }] = useWithRefresh({ isImmediate: false });

    // const handleLogOut = () => {
    //     (async () => {
    //         try {
    //             const logOut = await axios.delete("http://127.0.0.1:5000/auth/logout", { headers: {Authorization: "Bearer " + authToken} })
    //             console.log("I logged out the user")
    //             logout();
    //             navigate('/')
    //         } catch(error) {
    //             console.log("Error while logging out of your account, try again")
    //         }
    //     });
    // }

    // I think there's an issue with deleting the user, bc while debuggin attempting to execute the function 
    // deleteAccount multiple times doesn't seem to cause any errors which doesn't make sense if the user
    // actually was deleted from the database
    const deleteAccount = (async () => {
            await executor(
              (token) => axios.request({url: `${API_URL}/student/profile`,  headers: {Authorization: "Bearer " + token}, method: 'DELETE'} ),
              (data) => {
                console.log(data);
                console.log("I deleted the user");
                onClose();
                logout();
                navigate('/');
              }
            );
    });

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