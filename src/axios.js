import axios from 'axios';

// baseURL: 'http://97.74.90.63:8080', // Adjust the baseURL to match your backend
//prd url = 97.74.90.63:8080
const instance = axios.create({
  baseURL: 'http://localhost:8080', // Adjust the baseURL to match your backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;