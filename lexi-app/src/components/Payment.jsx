import { Box, Heading, Divider, Text, Flex, Button, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, InputGroup, InputLeftAddon, useToast} from "@chakra-ui/react"
import { useWithRefresh } from '../utils/useWithRefresh';
import { useEffect, useState } from "react";
import { API_URL } from '../utils/config';
import axios from "axios";

export default function Payment() {
    const [input, setInput] = useState({});
    const toast = useToast();
    const [executor, { isLoading, isSuccess, isRefreshing }] = useWithRefresh({ isImmediate: false });

    const handleToast = () => {
        // add a promise rejection handler
        toast({
            title: "Your profile has been updated successfully!",
            status: 'success',
            duration: 3000,
            isClosable: true,
        })();
    }

    const handleClick = () => {
        (async () => {
            await executor(
                (token) => axios.put(`${API_URL}/mentor/profile`, input, { headers: { Authorization: "Bearer " + token } }),
                (_) => {
                    getProfile()
                    handleToast();
                }
            );
        })();
    }

    const handleChange = (value) => {
        setInput({ ...input, price_per_hour: value});
    };

    const getProfile = (async () => {
        await executor(
            (token) => axios.get(`${API_URL}/mentor/profile`, { headers: { Authorization: "Bearer " + token } }),
            (data) => setInput(data.data.profile)
        );
    });

    useEffect(()=>{
        getProfile();
    },[])


    return <Box  m="30px" mt="0px">
        <Box w="80%">
            <Heading fontSize="xl" mb={4}>Payment Settings</Heading>
            <Divider orientation='horizontal' mb={4}/>

            <Text>
            Your hourly rate is the amount you'll charge per class, which is currently 30 mins by default for your mentoring sessions. Consider factors such as your expertise, experience, and the value you provide to your mentees when setting your rate.
            </Text>

            <InputGroup mt={4}>
            <InputLeftAddon>$</InputLeftAddon>
            <NumberInput maxW="100px"step={5} value={input.price_per_hour} defaultValue={30} min={0} max={100} onChange={handleChange}>
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
            </InputGroup>
            <Divider orientation='horizontal' mt={4} mb={4}/>

            <Button colorScheme="facebook" mt={4}>Connect Your PayPal</Button>
        </Box>
        <Flex justify="flex-end" mt={7}>
            <Button className="right-aligned" colorScheme="teal" onClick={handleClick}>Save</Button>
        </Flex>
    </Box>
}