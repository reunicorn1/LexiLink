import axios from "./axios"
import { useEffect } from "react";
import { useAuth } from "../AuthContext";


const useAxiosPrivate = () => {
    const {refresh, authToken } = useAuth();

    useEffect(() => {

        const requesstIntercept = axios.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    console.log("This is access token", authToken);
                    config.headers['Authorization'] = `Bearer ${authToken}`;
                } 
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axios.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.data.status === 410 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    // Since refresh failed, the value of the accesstokem is undefined
                    // So when the request gets remade we get 411 => 412 (this happened bc token are invalid)
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axios(prevRequest)
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(responseIntercept)
            axios.interceptors.response.eject(responseIntercept)
        }
    }, [authToken, refresh])
    return axios;
}

export default useAxiosPrivate