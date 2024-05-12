import Banner from "../components/Banner"
import NewsBanner from "../components/NewsBanner"
import SecondBanner from "../components/SecondBanner"
import FinalBanner from "../components/FinalBanner"
import Footer from "../components/Footer"
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext';
import Video from "../components/Video"


export default function Home () {
    const { authToken, role } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if (authToken){
            if (role === "student") {
                navigate("/dashboard");
            } else {
                navigate("/mentor/dashboard");
            }
        }
    }, [])


    return <>
    {
        !authToken && 
        <div>
            <Banner />
            <NewsBanner />
            <SecondBanner />
            <FinalBanner />
            <Footer></Footer>
        </div>
    }   
    </>
}