import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://10.176.113.7:5000/',
});

export default instance;
