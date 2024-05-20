import axios from "./axios"
import { useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useState } from "react";



const useAxiosPrivate = (isLoading, setIsLoading) => {
    const {refresh, authToken } = useAuth();
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

    useEffect(() => {

        const requestIntercept = axios.interceptors.request.use(
            config => {
                if (!hasLoadedOnce) {
                // setIsLoading(true);
                setHasLoadedOnce(true);
                }
                if (!config.headers['Authorization']) {
                    // console.log("This is access token", authToken);
                    config.headers['Authorization'] = `Bearer ${authToken}`;
                } 
                return config;
            }, (error) =>{
                setIsLoading(false);
                return Promise.reject(error)
                }
        );

        const responseIntercept = axios.interceptors.response.use(
            response => 
            {
                setIsLoading(false);
                return response;
            },
            async (error) => {
                setIsLoading(false);
                const prevRequest = error?.config;
                if (error?.response?.status === 410 && !prevRequest?.sent) {
                    console.log("okay?")
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    // Since refresh failed, the value of the accesstokem is undefined
                    // So when the request gets remade we get 411 => 412 (this happened bc token are invalid)
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axios(prevRequest)
                }
                return Promise.reject("this is error", error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestIntercept)
            axios.interceptors.response.eject(responseIntercept)
        }
    }, [authToken, refresh])
    return  axios;
}

export default useAxiosPrivate