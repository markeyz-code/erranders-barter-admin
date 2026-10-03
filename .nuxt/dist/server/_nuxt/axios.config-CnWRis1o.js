import axios from "axios";
const envApiUrl = "https://barter-backend-api.erranders.org/api/v1";
const GATEWAY_ENDPOINT = axios.create({
  baseURL: envApiUrl,
  timeout: 15e3
});
const GATEWAY_ENDPOINT_WITH_AUTH = axios.create({
  baseURL: envApiUrl,
  timeout: 15e3
});
function getCookie(name) {
  return null;
}
[GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH].forEach((instance) => {
  instance.interceptors.request.use((config) => {
    let currentToken = getCookie();
    if (currentToken) {
      let cleanToken = decodeURIComponent(currentToken).replace(/^"|"$/g, "");
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
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
//# sourceMappingURL=axios.config-CnWRis1o.js.map
