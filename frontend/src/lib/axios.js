
import axios from "axios";


export const axiosInstance = axios.create({
    baseURL :import.meta.env.baseURL || "http://localhost:4000/api",
    withCredentials: true,
})