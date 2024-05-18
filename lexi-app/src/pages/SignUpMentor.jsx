import { useState } from "react";
//import bcrypt from "bcryptjs-react";

import axios from "axios";
import {
    Step,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    useSteps,
    Box, 
    useToast
  } from '@chakra-ui/react'
import SignUpMentorOne from "../components/SignUpMentorOne";
import SignUpMentorTwo from "../components/SignUpMentorTwo";
import SignUpMentorThree from "../components/SignUpMentorThree";
import SignUpMentorFour from "../components/SignUpMentorFour";
import { API_URL } from '../utils/config';

//const salt = bcrypt.genSaltSync(10);

export default function SignUpMentor () {
    
    const [input, setInput] = useState({ email: "", password: "", username: "", first_name: "", last_name: "", country:"", nationality:"", first_language: "", education:"", expertise:"", type: "Community", availability: {days: [], startTime: "", endTime: ""}, profile_picture: "", user_type:"mentor" })
    const [step, setStep] = useState(1); //the common state between all steps 
    const [formError, setFormError] = useState({email: "", password: "", username: ""});
    const toast = useToast()

    let emailValid = true;
    
    const handleClick = () => {
      // Ignore this for now

      const errors = {...formError, email: "", password: ""};
      if (!input.email) {
          errors.email = "This field is required";
        } else if (!isValidEmail(input.email)) {
          errors.email = "Invalid email address";
        }if (input.password.length < 6) {
          errors.password = "This field must be at least 6 characters";
        }

        (async () => {
          try {
            const result = await axios.post(`${API_URL}/auth/verify_email`, { email: input.email, user_type: "mentor" });
             if (input.email && isValidEmail(input.email) && input.password.length >= 6 && emailValid) {
              // setInput({ ...input, password: bcrypt.hashSync(input.password, salt) });
              // Sending data to the API, receiving either an error or not
              handleNext();
          }
          } catch (error) {
            if (error.response && error.response.status === 403) {
              errors.email = error.response.data.error;
              emailValid = false
            } else {
              console.error("An error occurred:", error);
            }
          }
          setFormError({ ...errors }); 
        })();
    };

      const handleGoogle = async (response) => {
        try {
          const result = await axios.post(`${API_URL}/auth/verify_email`, { email: response.data.email, user_type: "mentor" });
          setInput({ ...input, first_name: response.data.given_name, last_name: response.data.family_name, email: response.data.email, password: response.data.sub, username: response.data.email.split('@')[0], profile_picture: response.data.picture})
          handleNext();
          handleStepper();
        } catch (error) {
          if (error.response && error.response.status === 403) {
            handleToast();
          } else {
            console.error("An error occurred:", error);
          }
        }
      }

    const handleToast = () => {
        toast({
            title: `This email is already used`,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
  
    const handleInputChange = (e) => {
        const { name, value } = e.currentTarget;
        setInput({ ...input, [name]: value });
        setFormError({ ...formError, [name]: ""})
    }

    const isValidEmail = (email) => {
        // Basic email validation regex
        const regex = /^[^@]+@[^@]+\.[^@]+$/;
        return regex.test(email);
    };

    const steps = [
        { title: 'Personalalize'},
        { title: 'Teaching'},
        { title: 'Availability'},
      ]


    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
      })
  
      
      function SteppingOver() {
        return (
          <Stepper colorScheme='teal' size='lg' index={activeStep}>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>
      
                <Box flexShrink='0'>
                  <StepTitle>{step.title}</StepTitle>
                </Box>
      
                <StepSeparator />
              </Step>
            ))}
          </Stepper>
        )
      }


    const handleNext = () => {
        setStep(step + 1);
    };

      const handleStepper = () => {
        setActiveStep(activeStep + 1);
        handleNext();
      }

    return <>
            {step === 1 && <SignUpMentorOne input={input} formError={formError} onChange={handleInputChange} onClick={handleClick} handleGoogle={handleGoogle}></SignUpMentorOne>}
            {step === 2 && <SignUpMentorTwo input={input} formError={formError} setFormError={setFormError} onChange={handleInputChange} handleStepper={handleStepper} SteppingOver={SteppingOver}></SignUpMentorTwo>}
            {step === 3 && <SignUpMentorThree input={input} setInput={setInput} onChange={handleInputChange} handleStepper={handleStepper} SteppingOver={SteppingOver}></SignUpMentorThree>}
            {step === 4 && <SignUpMentorFour input={input} setInput={setInput} onChange={handleInputChange} handleStepper={handleStepper} SteppingOver={SteppingOver}></SignUpMentorFour>}
    </>
}