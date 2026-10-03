import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const adminApi = {
  getUsers: () => GATEWAY_ENDPOINT_WITH_AUTH.get('/users/admin/all'),
  getEscrows: () => GATEWAY_ENDPOINT_WITH_AUTH.get('/escrow/admin/all'),
};
