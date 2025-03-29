import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://dashboard-backend.duckdns.org",
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;