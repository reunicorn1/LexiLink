import { useState } from "react";
//import bcrypt from "bcryptjs-react";
import SignUpStepOne from "../components/SignUpStepOne";
import SignUpStepTwo from "../components/SignUpStepTwo";
import axios from "axios";

//const salt = bcrypt.genSaltSync(10);

export default function SignUp () {

    const [input, setInput] = useState({ email: "", password: "", username: "", first_name: "", last_name: "", country:"", nationality:"", first_language: "", proficiency:"", user_type:"student" })
    const [step, setStep] = useState(1); //the common state between all steps 
    const [formError, setFormError] = useState({email: "", password: "", username: "", first_name: "", last_name: "", country:"", nationality:"", first_language: "", proficiency:""});
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
              const result = await axios.post("http://127.0.0.1:5000/auth/verify_email", { email: input.email });
            } catch (error) {
              if (error.response && error.response.status === 400) {
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
            {step === 1 && <SignUpStepOne input={input} formError={formError} onChange={handleInputChange} onClick={handleClick}></SignUpStepOne>}
            {step == 2 && <SignUpStepTwo input={input} formError={formError} setFormError={setFormError} onChange={handleInputChange} setInput={setInput}></SignUpStepTwo>}
    </>
}