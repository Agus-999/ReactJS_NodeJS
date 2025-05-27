import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000', // Tu backend
});

export default API;
