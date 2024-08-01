import axios from "axios";

export const API_URL = "http://localhost:5000";

export const api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
    return config;
})

api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && originalRequest && !originalRequest._isRetry) {
        originalRequest._isRetry = true;
        const res = await axios.get(`${API_URL}/token/refresh`, {withCredentials: true}); 
        localStorage.setItem("token", res.data.accessToken);        
        return api.request(originalRequest);
    }
    throw error;
})