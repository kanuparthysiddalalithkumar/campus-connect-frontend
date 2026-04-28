import axios from 'axios';

// In Vercel, set VITE_API_URL = https://your-railway-url.up.railway.app/api
// Locally it falls back to localhost:8080
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 60000,  // 60 seconds — handles Railway cold starts (can take 30-50s)
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

// Global response interceptor — auto-retry once on timeout/network error
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;

        // Retry once on timeout or network error (not on 4xx/5xx)
        if (!error.response && !config._retried) {
            config._retried = true;
            console.warn('[API] Request timed out or network error — retrying once...');
            // Wait 2 seconds before retry
            await new Promise(r => setTimeout(r, 2000));
            return api(config);
        }

        if (!error.response) {
            console.error('[API] Backend unreachable after retry:', error.message);
        }
        return Promise.reject(error);
    }
);

// Warm up the backend on app load to avoid cold start timeout during login/register
export const warmUpBackend = async () => {
    try {
        await axios.get(`${BASE_URL}/health`, { timeout: 60000 });
    } catch (e) {
        // Ignore — warmup is best-effort
    }
};

export default api;
