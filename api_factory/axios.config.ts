import axios from "axios";

const envApiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3005/api/v1";

export const GATEWAY_ENDPOINT = axios.create({
  baseURL: envApiUrl,
  timeout: 15000
});

export const GATEWAY_ENDPOINT_WITH_AUTH = axios.create({
  baseURL: envApiUrl,
  timeout: 15000
});

[GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH].forEach(instance => {
  instance.interceptors.request.use((config) => {
    let currentToken = null;
    if (typeof window !== 'undefined') {
      currentToken = localStorage.getItem('barter_token');
    }
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (err) => {
      if (err.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('barter_token');
          window.location.href = '/login';
        }
      }
      return Promise.reject(err);
    }
  );
});
