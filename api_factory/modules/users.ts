import { GATEWAY_ENDPOINT } from '../axios.config';
export const usersApi = {
  getProfile: () => GATEWAY_ENDPOINT.get('/users/me')
};