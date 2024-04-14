import axios from "axios";

const BASE_URL = "http://localhost:3000/";
// const BASE_URL = "http://localhost:3000/auth"

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Enable credentials
});

// Function to register a new user
export const register = (userData) => {
    return api.post('/auth/register', userData);
};

// Function to delete user
export const deleteUser = id => api.delete(`/users/${id}`);

export default {
    register,
    deleteUser
}