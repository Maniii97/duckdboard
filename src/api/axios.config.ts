import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL as string;

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
