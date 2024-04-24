import { Text, Flex, Box, GridItem, FormControl, FormLabel, Heading, Input, Select, Center, Divider, Stack, Radio, RadioGroup, Button } from "@chakra-ui/react";
import { useEffect, useState, Dispatch, ChangeEvent } from "react";
import axios from "axios";

interface SignUpStepTwoProps {
    input: {
      email: string;
      password: string;
      username: string,
      firstname: string, 
      lastname: string, 
      country: string, 
      nationality:string, 
      firstlanguage: string, 
      proficency:string
    };

    formError: {
      email: string;
      password: string;
      username: string,
      firstname: string, 
      lastname: string, 
      country: string, 
      nationality:string, 
      firstlanguage: string, 
      proficency:string
      };
    setFormError: Dispatch<{ email: string; password: string; username: string; firstname: string; lastname: string; country: string; nationality: string; firstlanguage: string; proficency: string; }>
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setInput: Dispatch<{ email: string; password: string; username: string; firstname: string; lastname: string; country: string; nationality: string; firstlanguage: string; proficency: string; }>;
  }

  const SignUpStepTwo: React.FC<SignUpStepTwoProps> = ({ input, formError, setFormError, onChange, setInput }) => {

    const handleChange = (value:string) => {
        setInput({ ...input, proficency: value});
        // setFormError({ ...formError, proficency: ""})
    };

    const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.currentTarget;
        setInput({ ...input, [name]: value });
        // setFormError({ ...formError, [name]: ""})
    }

    const handleSubmit = (e: React.MouseEvent) => {
        const errors = { ...formError };
        console.log(input)

    }

    const [countries, setCountries] = useState([]); 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://restcountries.com/v3.1/all?fields=name,demonyms");
                response.data.sort((a:any, b:any) => a.name.common.localeCompare(b.name.common));
                setCountries(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return <>
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={6} m="100px" color="black" bg="white" justifyContent="center" rounded="3xl">
                <GridItem colSpan={{base: 2, lg: 1}} m="50px">
                    <Heading mb={2}>Let's get to know you better!</Heading>
                    <Text mb={10}>Provide the following details to tailor your learning journey</Text>
                    <FormControl>
                        <FormLabel>Username</FormLabel>
                        <Input isInvalid={Boolean(formError.username)} mb={3} placeholder="Enter your username" name="username" value={input.username} onChange={onChange}></Input>
                    </FormControl>
                    <FormControl>
                        <FormLabel>First Name</FormLabel>
                        <Input isInvalid={Boolean(formError.firstname)} mb={3} placeholder="Enter your first name" name="firstname" value={input.firstname} onChange={onChange}></Input>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Last Name</FormLabel>
                        <Input isInvalid={Boolean(formError.lastname)} mb={3} placeholder="Enter your last name" name="lastname" value={input.lastname} onChange={onChange}></Input>
                    </FormControl>
                    <FormLabel>Country</FormLabel>
                    <Select isInvalid={Boolean(formError.country)} placeholder='Select your country' name="country" value={input.country} onChange={handleSelect}>
                         {countries?.map((item: any, index: number) => (
                            <option key={index} value={item.name.common}>
                            {item.name.common}
                            </option>
                         ))}
                    </Select>
                </GridItem >
                <GridItem m="50px" colSpan={{base: 2, lg: 1}}>
                    <FormControl>
                        <FormLabel>First Language</FormLabel>
                        <Input isInvalid={Boolean(formError.firstlanguage)} mb={3}placeholder="Enter your first language" name="firstlanguage" value={input.firstlanguage} onChange={onChange}></Input>
                    </FormControl>
                    <FormLabel>Nationality</FormLabel>
                    <Select isInvalid={Boolean(formError.nationality)} mb={7} placeholder='Select your nationality' name="nationality" onChange={handleSelect}>
                         {countries?.map((item: any, index: number) => (                      
                            <option key={index} value={item.demonyms.eng.m}>
                                {item.demonyms.eng.m}
                            </option>
                         ))}
                    </Select>
                    <FormLabel>How would you describe your English proficiency?</FormLabel>
                    <RadioGroup  mb="80px" defaultValue='1' name="proficiency"  value={input.proficency} onChange={handleChange}>
                        <Stack>
                            <Radio value='0'>0 - No proficiency</Radio>
                            <Radio value='1'>1 - Low proficiency</Radio>
                            <Radio value='2'>2 - Intermediate proficiency</Radio>
                            <Radio value='3'>3 - Upper Intermediate proficiency</Radio>
                            <Radio value='4'>4 - High proficiency</Radio>
                        </Stack>
                    </RadioGroup>
                    <Flex justify="flex-end">
                        <Button onClick={handleSubmit} className="right-aligned" colorScheme="facebook">Submit</Button>
                    </Flex>
                </GridItem>
              </Box>
    </>
};
export default SignUpStepTwo;