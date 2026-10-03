import axios from "axios";
const envApiUrl = "http://localhost:3005/api/v1";
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
      if (err.response?.status === 401) ;
      return Promise.reject(err);
    }
  );
});
export {
  GATEWAY_ENDPOINT as G,
  GATEWAY_ENDPOINT_WITH_AUTH as a
};
//# sourceMappingURL=axios.config-CygDw6DA.js.map
