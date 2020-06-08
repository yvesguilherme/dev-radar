import axios from 'axios';

/**
 * Resolver o problema do IP do DOCKERNAT ao subir o axios
 * >> set REACT_NATIVE_PACKAGER_HOSTNAME=192.168.0.12 
 */

const api = axios.create({
  baseURL: 'http://192.168.0.12:3333',
});

export default api;