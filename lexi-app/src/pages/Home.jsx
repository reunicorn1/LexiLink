import Banner from "../components/Banner"
import NewsBanner from "../components/NewsBanner"
import SecondBanner from "../components/SecondBanner"
import FinalBanner from "../components/FinalBanner"
import Footer from "../components/Footer"
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext';


export default function Home () {
    const { authToken } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if (authToken){
            navigate("/dashboard");
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