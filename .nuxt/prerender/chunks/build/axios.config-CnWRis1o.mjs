import axios from 'file:///Users/marquis/erranders/barter/admin/node_modules/axios/index.js';

const envApiUrl = "https://barter-backend-api.erranders.org/api/v1";
const GATEWAY_ENDPOINT = axios.create({
  baseURL: envApiUrl,
  timeout: 15e3
});
const GATEWAY_ENDPOINT_WITH_AUTH = axios.create({
  baseURL: envApiUrl,
  timeout: 15e3
});
[GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH].forEach((instance) => {
  instance.interceptors.request.use((config) => {
    return config;
  });
  instance.interceptors.response.use(
    (response) => response,
    (err) => {
      var _a;
      if (((_a = err.response) == null ? void 0 : _a.status) === 401) ;
      return Promise.reject(err);
    }
  );
});

export { GATEWAY_ENDPOINT as G, GATEWAY_ENDPOINT_WITH_AUTH as a };
//# sourceMappingURL=axios.config-CnWRis1o.mjs.map
