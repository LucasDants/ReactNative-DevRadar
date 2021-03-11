import axios from 'axios';

const api = axios.create({
  baseURL: 'http://IPV4:3333',
});

export default api;
