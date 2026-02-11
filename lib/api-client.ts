import axios from 'axios';
import { ApiResponse } from './types';

// Hardcoded for now as per instructions, ideally move to env vars
const API_BASE_URL = 'https://api-stage.datachannel.co';
const ACCOUNT_SLUG = 'dc-frontendtest-004';
const API_KEY = '4c2d631cef9afbfba65b9873673a3fc4';
const WORKSPACE_ID = '57';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-ACCOUNT-SLUG': ACCOUNT_SLUG,
        'X-API-KEY': API_KEY,
        'X-WORKSPACE-ID': WORKSPACE_ID,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    },
});

// Request interceptor to enforce no-cache
apiClient.interceptors.request.use((config) => {
    // 1. Remove conditional headers
    // @ts-ignore
    delete config.headers['If-None-Match'];

    // 2. Add timestamp to GET requests to bust browser cache
    // This forces the browser to treat it as a new URL
    if (config.method === 'get') {
        config.params = { ...config.params, _t: Date.now() };
    }

    return config;
});

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // We can add global error logging here
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Generic fetcher function for React Query
export const fetcher = async <T>(url: string, params?: any): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T>>(url, { params });
    console.log(`[API] ${url} response:`, response.data);
    return response.data.data;
};

// Generic poster function
export const poster = async <T>(url: string, data: any): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data);
    return response.data.data;
};
