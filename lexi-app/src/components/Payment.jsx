import { Box, Heading, Divider, Text, Flex, Button, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, InputGroup, InputLeftAddon, useToast} from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { API_URL } from '../utils/config';
import useAxiosPrivate from "../utils/useAxiosPrivate";
import axios from "axios";

export default function Payment() {
    const executor = useAxiosPrivate();
    const [input, setInput] = useState({});
    const toast = useToast();

    const handleToast = () => {
        // add a promise rejection handler
        toast({
            title: "Your profile has been updated successfully!",
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    }

    const handleClick = () => {
        (async () => {
            try {
                const response = await executor.put(`/mentor/profile`, input);
                getProfile()
                handleToast();
            } catch (err) {
                console.error(err);
            }
        })();
    }

    const handleChange = (value) => {
        setInput({ ...input, price_per_hour: value});
    };

    const getProfile = (async () => {
        try {
            const response = await executor.get(`/mentor/profile`);
            setInput(response.data.profile)
        } catch (err) {
            console.error(err);
        }
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