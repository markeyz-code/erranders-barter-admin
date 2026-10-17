import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

// Settings are read by the public checkout, but the admin always sends its bearer token.
export const settingsApi = {
  get: (key: string) => GATEWAY_ENDPOINT_WITH_AUTH.get(`/settings/${key}`),
  update: (key: string, value: any) =>
    GATEWAY_ENDPOINT_WITH_AUTH.post(`/settings/${key}`, { value }),
};
