import axios from 'axios';

const API = axios.create({
  baseURL: 'https://organ-backend-iemp.onrender.com',
});

const getPathname = (url) => {
  if (!url) return '';

  try {
    const parsedUrl = new URL(url, 'http://localhost');
    return parsedUrl.pathname;
  } catch {
    return url;
  }
};

const getAuthToken = (config) => {
  const url = getPathname(config.url);
  const defaultAdminToken = localStorage.getItem('token') || localStorage.getItem('adminToken');
  const donorToken = localStorage.getItem('donorToken');
  const recipientToken = localStorage.getItem('recipientToken');

  if (url.startsWith('/donor')) {
    return donorToken;
  }

  if (url.startsWith('/recipient')) {
    return recipientToken;
  }

  if (
    url.startsWith('/admin') ||
    url.startsWith('/match') ||
    (config.method === 'patch' && url.startsWith('/donor/status')) ||
    (config.method === 'patch' && url.startsWith('/recipient/status'))
  ) {
    return defaultAdminToken;
  }

  return defaultAdminToken;
};

API.interceptors.request.use((config) => {
  const token = getAuthToken(config);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const pathname = getPathname(error.config?.url);
    const isLoginRoute = pathname === '/admin/login';
    const isRegisterRoute = pathname === '/admin/register';

    if ((status === 401 || status === 403) && !isLoginRoute && !isRegisterRoute) {
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
