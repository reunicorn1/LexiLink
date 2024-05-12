import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';


/**
 * hook that makes ajax request and if token expires retry again,
 * with the refresh token.
 * @param {() => Promise<void>} ajax - function return a promise
 * @param {Function} callback - any function to be executed after promise fullfiled
 * @param {boolean} isImmediate - a flag to immediately trigger the ajax request or not 
 * 
 * @return {object} - an object containing isSuccess, isLoading, data, isRefreshing
 */
export function useWithRefresh({ ajax = async () => { }, callback = async () => { }, isImmediate = true }) {
    const [isLoading, setLoading] = useState(false)
    const [isSuccess, setSuccess] = useState(false)
    const [isRefreshing, setRefresh] = useState(false)
    const [data, setData] = useState();
    const { refresh, refreshToken, authToken, logout } = useAuth();
    const navigate = useNavigate();

    const executor = (ajax, cb) => {
        setLoading(true)
        ajax(authToken)
            .then(data => {
                cb(data)
                setSuccess(true)
                setData(data)
                setLoading(false)
            })
            .catch(err => {
                if (err.response.status == 410) {
                    setRefresh(true)
                    refresh()
                        .then(data => {
                            ajax(data)
                                .then(data => {
                                    cb(data)
                                    setSuccess(true)
                                    setLoading(false)
                                    setData(data)
                                })
                                .catch(err => console.log({ err }))
                        })
                        .catch(err => console.log({ err }))
                }
                else {
                    console.log({ err })
                }

            })
            
    }

    const handleLogOut = async () => {
        executor(
        (token) => axios.delete(`${API_URL}/auth/logout`, {data: {refresh_token: refreshToken}}, { headers: { Authorization: "Bearer " + token } }),
        (_) => followup()
        )
    }

    useEffect(() => {
        let ignore = false;

        if (isImmediate && !ignore) {
            setLoading(true)
            ajax(authToken)
                .then(data => {
                    setSuccess(true)
                    setData(data)
                    setLoading(false)
                    callback(data)
                })
                .catch(err => {
                    if (err.response.status == 410) {
                        setRefresh(true)
                        refresh()
                            .then(data => {
                                ajax(data)
                                    .then(data => {
                                        callback(data)
                                        setSuccess(true)
                                        setLoading(false)
                                        setData(data)
                                    })
                                    .catch(err => console.log({ err }))
                            })
                            .catch(err => console.log({ err }))
                    }
                    else if (err.response.status == 411) {
                        logout();
                        handleLogOut();
                        navigate('/');
                    }
                    else {
                        console.log({ err })
                    }
                })
        }

        // cleanup
        return () => {
            ignore = true;
        }
    }, [])


    return [executor, { isSuccess, isLoading, data, isRefreshing }]
}
