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

function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

[GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH].forEach(instance => {
  instance.interceptors.request.use((config) => {
    let currentToken = getCookie('barter_token');
    
    // Fallback to localStorage just in case
    if (!currentToken && typeof window !== 'undefined') {
      currentToken = localStorage.getItem('barter_token');
    }

    if (currentToken) {
      // Nuxt's useCookie JSON-stringifies the token, adding quotes. We must remove them.
      let cleanToken = decodeURIComponent(currentToken).replace(/^"|"$/g, '');
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (err) => {
      if (err.response?.status === 401) {
        if (typeof window !== 'undefined') {
          document.cookie = 'barter_token=; Max-Age=0; path=/';
          localStorage.removeItem('barter_token');
          window.location.href = '/login';
        }
      }
      return Promise.reject(err);
    }
  );
});
