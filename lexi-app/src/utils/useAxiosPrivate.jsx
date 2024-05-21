import axios from "./axios"
import { useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useState } from "react";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import dayjs from "dayjs";

const useAxiosPrivate = () => {
    const {refresh, authToken, refreshToken } = useAuth();
    useEffect(() => {
        const requestIntercept = axios.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${authToken}`;
                }
                if (config.method === 'delete' && config.url.endsWith('/profile')) {
                    config.data = {refresh_token: refreshToken};
                }
                return config;
            }, (error) =>{
                return Promise.reject(error)
                }
        );
        const responseIntercept = axios.interceptors.response.use(
            response => 
            {
                return response;
            },
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 410 && !prevRequest?.sent) {
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
            axios.interceptors.request.eject(requestIntercept)
            axios.interceptors.response.eject(responseIntercept)
        }
    }, [authToken, refresh])
    return  axios;
}

export default useAxiosPrivate