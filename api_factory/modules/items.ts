import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

// POST /items is JWT-guarded, so the authenticated instance is required.
export const itemsApi = {
  list: (params: any) => GATEWAY_ENDPOINT_WITH_AUTH.get('/items', { params }),
  getById: (id: string) => GATEWAY_ENDPOINT_WITH_AUTH.get(`/items/${id}`),
  create: (data: any) => GATEWAY_ENDPOINT_WITH_AUTH.post('/items', data),
};
