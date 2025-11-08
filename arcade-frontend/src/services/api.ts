import axios from 'axios';

export const publicApi = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const privateApi = axios.create({
  baseURL: 'http://localhost:5000/api'
});

privateApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});