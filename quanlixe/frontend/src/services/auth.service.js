import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';



const login = (email, password) => {
    return axios.post(API_URL + 'login', { email, password });
};

const register = (name, password, email) => {
    return axios.post(API_URL + 'register', {name, password, email });
};
const resetPassword = (email, otp, newPassword) => {
    return axios.post(API_URL + 'reset-password', {
        email,
        otp,           // OTP code mà người dùng đã nhận
        password: newPassword // Mật khẩu mới
    });
};
export default {
    login,
    register,
    resetPassword
};
