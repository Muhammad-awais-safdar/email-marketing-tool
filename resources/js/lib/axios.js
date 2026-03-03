import axios from "axios";

const api = axios.create({
    baseURL: "/",
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access (e.g., redirect to login)
            window.location.href = "/login";
        }
        return Promise.reject(error);
    },
);

export default api;
