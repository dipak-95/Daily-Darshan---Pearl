import axios from 'axios';
import { API_URL } from '../constants/config';

const api = axios.create({
    baseURL: API_URL,
});

export const getTemples = () => api.get('/temples');
export const getTempleById = (id) => api.get(`/temples/${id}`);
export const getDarshan = (templeId, type) => api.get(`/darshan/${templeId}?type=${type}`);

export default api;
