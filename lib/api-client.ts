import axios from 'axios';
import { ApiResponse } from './types';

// Load credentials from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ACCOUNT_SLUG = process.env.NEXT_PUBLIC_ACCOUNT_SLUG;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const WORKSPACE_ID = process.env.NEXT_PUBLIC_WORKSPACE_ID;

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
    // Ensure we always return a value, not undefined
    const result = response.data.data;
    if (result === undefined) {
        console.warn(`[API] ${url} returned undefined data, returning empty object/array`);
        return {} as T;
    }
    return result;
};

// Generic poster function
export const poster = async <T>(url: string, data: any): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data);
    return response.data.data;
};
