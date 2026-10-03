import { GATEWAY_ENDPOINT } from '../axios.config';
export const authApi = {
  signup: (data: any) => GATEWAY_ENDPOINT.post('/auth/signup', data),
  login: (data: any) => GATEWAY_ENDPOINT.post('/auth/login', data)
};