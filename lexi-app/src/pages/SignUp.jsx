import { useState } from "react";
import { useToast } from "@chakra-ui/react";
//import bcrypt from "bcryptjs-react";
import SignUpStepOne from "../components/SignUpStepOne";
import SignUpStepTwo from "../components/SignUpStepTwo";
import axios from "axios";
import { API_URL } from '../utils/config';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../AuthContext';
import { useEffect } from "react";

export default function SignUp ({ isLoading, setIsLoading }) {

    const [input, setInput] = useState({ email: "", password: "", username: "", first_name: "", last_name: "", country:"", nationality:"", first_language: "", proficiency:"", user_type:"student" })
    const [step, setStep] = useState(1); //the common state between all steps 
    const [formError, setFormError] = useState({email: "", password: "", username: "", first_name: "", last_name: "", country:"", nationality:"", first_language: "", proficiency:""});
    const toast = useToast()
    const navigate = useNavigate();
    const { role } = useAuth();

    useEffect(() => {
      if ( role ) {
        navigate("/");
      }
    }, [])

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
              const result = await axios.post(`${API_URL}/auth/verify_email`, { email: input.email, user_type: "student" });
            } catch (error) {
              if (error.response && error.response.status === 403) {
                errors.email = error.response.data.error;
                emailValid = false
              } else {
                console.error("An error occurred:", error);
              }
            }
            setFormError({ ...errors }); 
            if (input.email && isValidEmail(input.email) && input.password.length >= 6 && emailValid) {
                // setInput({ ...input, password: bcrypt.hashSync(input.password, salt) });
                // Sending data to the API, receiving either an error or not
                handleNext();
            }

          })();
      };

      const handleToast = () => {
        // add a promise rejection handler
        toast({
            title: `This email is already used`,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }

    const handleGoogle = async (response) => {
        try {
          const result = await axios.post(`${API_URL}/auth/verify_email`, { email: response.data.email, user_type: "student" });
          setInput({ ...input, first_name: response.data.given_name, last_name: response.data.family_name, email: response.data.email, password: response.data.sub, username: response.data.email.split('@')[0], profile_picture: response.data.picture})
          handleNext();
        } catch (error) {
          if (error.response && error.response.status === 403) {
            handleToast();
          } else {
            console.error("An error occurred:", error);
          }
        }
      }

    const handleNext = () => {
        setStep(step + 1);
    };

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


    // After Api is implemented, check if the email is in the database after user clicks submit  --- DONE

    return <>
            {step === 1 && <SignUpStepOne input={input} formError={formError} onChange={handleInputChange} onClick={handleClick} handleGoogle={handleGoogle}></SignUpStepOne>}
            {step == 2 && <SignUpStepTwo input={input} formError={formError} setFormError={setFormError} onChange={handleInputChange} setInput={setInput}></SignUpStepTwo>}
    </>
}
