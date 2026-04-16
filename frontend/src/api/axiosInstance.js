import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Your backend address
});

// This automatically adds the login token to every request
axiosInstance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("revogueUser"));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default axiosInstance;