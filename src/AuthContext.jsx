import { createContext, useContext, useState, useEffect } from 'react';
import api from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [registrations, setRegistrations] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem('cc_user');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.user && parsed.user.role) parsed.user.role = parsed.user.role.toLowerCase();
            setUser(parsed.user); // Store only user info
            fetchNotifications(parsed.user.id);
            fetchRegistrations(parsed.user.id);
        }
        setLoading(false);
    }, []);

    const fetchNotifications = async (userId) => {
        try {
            const res = await api.get(`/notifications/${userId}`);
            setNotifications(res.data);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        }
    };

    const fetchRegistrations = async (userId) => {
        try {
            const res = await api.get(`/participation/user/${userId}`);
            setRegistrations(res.data);
        } catch (err) {
            console.error('Failed to fetch registrations', err);
        }
    };

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const data = res.data; // { token, user }
        if (data.user && data.user.role) data.user.role = data.user.role.toLowerCase();
        setUser(data.user);
        localStorage.setItem('cc_user', JSON.stringify(data));
        fetchNotifications(data.user.id);
        fetchRegistrations(data.user.id);
        return data.user;
    };

    const register = async (name, email, password, department, year) => {
        const res = await api.post('/auth/register', { name, email, password, department, year });
        const data = res.data;
        if (data.user && data.user.role) data.user.role = data.user.role.toLowerCase();
        setUser(data.user);
        localStorage.setItem('cc_user', JSON.stringify(data));
        setNotifications([]);
        setRegistrations([]);
        return data.user;
    };

    const logout = () => {
        setUser(null); 
        setNotifications([]);
        setRegistrations([]);
        localStorage.removeItem('cc_user');
    };

    const markRead = async (id) => {
        await api.put(`/notifications/${id}/read`);
        setNotifications(p => p.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const markAllRead = async () => {
        if (!user) return;
        await api.put(`/notifications/all/read/${user.id}`);
        setNotifications(p => p.map(n => ({ ...n, isRead: true })));
    };

    const registerForActivity = async (activityId) => {
        if (!user) return false;
        try {
            const res = await api.post(`/participation/${user.id}/${activityId}`);
            setRegistrations(p => [...p, res.data]);
            fetchNotifications(user.id); // Get the confirmation notice
            return true;
        } catch (err) {
            console.error('Registration failed', err);
            return false;
        }
    };

    const isRegistered = (aId) => registrations.some(r => r.activity?.id === aId || r.activityId === aId);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <AuthContext.Provider value={{
            user, loading, notifications, registrations, unreadCount,
            login, register, logout, markRead, markAllRead,
            registerForActivity, isRegistered,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
};
