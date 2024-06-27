import axios from "./axios";
import { useEffect } from "react";
import { useAuth } from "../AuthContext";

/**
 * Custom hook for creating an axios instance with private interceptors.
 * 
 * @returns {object} Configured axios instance
 */
const useAxiosPrivate = () => {
    const { refresh, authToken, refreshToken } = useAuth();

    useEffect(() => {
        /**
         * Request interceptor to add authorization header and handle specific delete requests.
         * 
         * @param {object} config - Axios request configuration
         * @returns {object} Updated config
         */
        const requestIntercept = axios.interceptors.request.use(
            config => {
                // Add Authorization header if not present
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${authToken}`;
                }
                // Handle delete requests to /profile endpoint
                if (config.method === 'delete' && config.url.endsWith('/profile')) {
                    config.data = { refresh_token: refreshToken };
                }
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );

        /**
         * Response interceptor to handle token refresh logic.
         * 
         * @param {object} response - Axios response
         * @returns {object} Response or retry request with new token
         */
        const responseIntercept = axios.interceptors.response.use(
            response => {
                return response;
            },
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 410 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axios(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptors on component unmount
        return () => {
            axios.interceptors.request.eject(requestIntercept);
            axios.interceptors.response.eject(responseIntercept);
        };
    }, [authToken, refresh, refreshToken]);

    return axios;
};

export default useAxiosPrivate;