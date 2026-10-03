import { GATEWAY_ENDPOINT } from '../axios.config';
export const itemsApi = {
  list: (params: any) => GATEWAY_ENDPOINT.get('/items', { params }),
  getById: (id: string) => GATEWAY_ENDPOINT.get(`/items/${id}`),
  create: (data: any) => GATEWAY_ENDPOINT.post('/items', data)
};