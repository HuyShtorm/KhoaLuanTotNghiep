import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

const login = (username, password) => {
    return axios.post(API_URL + 'login', { username, password });
};

const register = (username, password, email) => {
    return axios.post(API_URL + 'register', { username, password, email });
};

export default {
    login,
    register
};
