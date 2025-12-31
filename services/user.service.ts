import { axiosInstance } from "./axios"

export const createUser = async (data:any)=>{
    return axiosInstance.post('/auth/register', data).then(res=>res.data);
}

export const getallUsers = async ()=>{
    return axiosInstance.get('/user').then(res=>res.data);
}