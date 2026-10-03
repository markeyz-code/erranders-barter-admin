import { GATEWAY_ENDPOINT } from '../axios.config';

export const settingsApi = {
  get: (key: string) => GATEWAY_ENDPOINT.get(`/settings/${key}`),
  update: (key: string, value: any) => GATEWAY_ENDPOINT.post(`/settings/${key}`, { value })
};
