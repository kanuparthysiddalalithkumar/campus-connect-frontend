import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children, role }) {
    const { user, loading } = useAuth();
    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-base)' }}>
            <div className="spinner" style={{ width: 40, height: 40 }} />
        </div>
    );
    if (!user) return <Navigate to="/login" replace />;
    if (role && user.role !== role) return <Navigate to="/dashboard" replace />;
    return children;
}
