import axios from 'axios';

// In Vercel, set VITE_API_URL = https://campus-connect-backend.up.railway.app/api
// Locally it falls back to localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'https://campus-connect-backend-production-2572.up.railway.app/api';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,  // 15 second timeout — Railway cold starts can be slow
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
    try {
        const stored = localStorage.getItem('cc_user');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.token) {
                config.headers.Authorization = `Bearer ${parsed.token}`;
            }
        }
    } catch (e) {
        // Silently ignore parse errors
    }
    return config;
});

// Global error handler — logs network errors clearly
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            // Network error — backend is down or CORS preflight failed
            console.error('[API] Network error — backend unreachable:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
