import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Layout from './Layout';
import Landing from './Landing';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Activities from './Activities';
import ActivityDetails from './ActivityDetails';
import MyActivities from './MyActivities';
import AdminPanel from './AdminPanel';
import Profile from './Profile';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#0f2817',
              border: '1px solid rgba(22,163,74,0.2)',
              borderRadius: '14px',
              fontSize: '13.5px',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 8px 32px rgba(22,163,74,0.15)',
              padding: '12px 16px',
            },
            success: { iconTheme: { primary: '#16a34a', secondary: '#f0fdf4' } },
            error: { iconTheme: { primary: '#dc2626', secondary: '#fef2f2' } },
            duration: 3500,
          }}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/activities/:id" element={<ActivityDetails />} />
            <Route path="/my-activities" element={<ProtectedRoute role="student"><MyActivities /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
