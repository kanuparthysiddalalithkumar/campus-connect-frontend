import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { GraduationCap, Eye, EyeOff, User, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState('student');
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    
    const s = k => v => setForm(p => ({ ...p, [k]: v }));

    const submit = async e => {
        e.preventDefault();
        if (!form.email || !form.password) { toast.error('Please fill in all fields'); return; }
        setLoading(true);
        try {
            await new Promise(r => setTimeout(r, 500));
            const u = await login(form.email, form.password);
            toast.success(`Welcome back, ${u.name.split(' ')[0]}!`);
            navigate('/dashboard');
        } catch (err) { 
            toast.error(err.response?.data?.message || err.message || "Failed to authenticate"); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden' }}>
            {/* Original Mesh Background to match landing page */}
            <div className="mesh-bg" aria-hidden>
                <div className="mesh-blob" style={{ width: 500, height: 500, background: '#22c55e', top: -150, left: -150, opacity: 0.09 }} />
                <div className="mesh-blob" style={{ width: 400, height: 400, background: '#16a34a', bottom: -100, right: -100, opacity: 0.07 }} />
            </div>

            <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
                
                {/* Logo Section matching landing page */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(22,163,74,0.35)' }}>
                        <GraduationCap size={28} color="#fff" />
                    </div>
                    <h1 className="font-display" style={{ fontWeight: 900, fontSize: 26, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CampusConnect</h1>
                </div>

                {/* Glass Card */}
                <div className="glass" style={{ padding: 36, borderRadius: 24 }}>
                    <div style={{ textAlign: 'center', marginBottom: 28 }}>
                        <h2 className="font-display" style={{ fontWeight: 800, fontSize: 22, color: 'var(--text-primary)', marginBottom: 6 }}>Welcome Back</h2>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Authenticate to access your portal</p>
                    </div>

                    {/* Role Toggle Tabs matching your layout design but adopting the glass/green colors */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        background: 'rgba(22,163,74,0.06)', 
                        border: '1px solid rgba(22,163,74,0.1)',
                        borderRadius: 14, 
                        padding: 6, 
                        marginBottom: 24 
                    }}>
                        <button 
                            type="button"
                            onClick={() => setRole('student')}
                            style={{
                                padding: '12px',
                                borderRadius: 10,
                                background: role === 'student' ? '#fff' : 'transparent',
                                color: role === 'student' ? 'var(--green-dark)' : 'var(--text-muted)',
                                fontWeight: 700,
                                fontSize: 14,
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: role === 'student' ? '0 4px 12px rgba(22,163,74,0.1)' : 'none'
                            }}
                        >
                            Student
                        </button>
                        <button 
                            type="button"
                            onClick={() => setRole('admin')}
                            style={{
                                padding: '12px',
                                borderRadius: 10,
                                background: role === 'admin' ? '#fff' : 'transparent',
                                color: role === 'admin' ? 'var(--green-dark)' : 'var(--text-muted)',
                                fontWeight: 700,
                                fontSize: 14,
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: role === 'admin' ? '0 4px 12px rgba(22,163,74,0.1)' : 'none'
                            }}
                        >
                            Admin
                        </button>
                    </div>

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Email Input */}
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                                <User size={18} />
                            </div>
                            <input 
                                className="input"
                                type="email" 
                                placeholder={role === 'admin' ? "admin@campus.edu" : "student@campus.edu"}
                                value={form.email} 
                                onChange={e => s('email')(e.target.value)}
                                style={{ paddingLeft: 46, background: 'rgba(255,255,255,0.7)' }}
                            />
                        </div>

                        {/* Password Input */}
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                                <Lock size={18} />
                            </div>
                            <input 
                                className="input"
                                type={show ? 'text' : 'password'} 
                                placeholder="Enter your password" 
                                value={form.password} 
                                onChange={e => s('password')(e.target.value)}
                                style={{ paddingLeft: 46, paddingRight: 44, background: 'rgba(255,255,255,0.7)' }}
                            />
                            <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                                {show ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        {/* Checkbox and Forgot Password */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 4px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                <input type="checkbox" style={{ accentColor: 'var(--green-dark)', width: 14, height: 14 }} />
                                <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>Remember me</span>
                            </label>
                            <button type="button" style={{ background: 'none', border: 'none', color: 'var(--green-dark)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                                Forgot password?
                            </button>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="btn btn-primary"
                            style={{ 
                                width: '100%', 
                                padding: '15px', 
                                fontSize: 15, 
                                justifyContent: 'center',
                                marginTop: 8
                            }}
                        >
                            {loading ? <div className="spinner" style={{ width: 18, height: 18, borderTopColor: '#fff' }} /> : 'Authenticate'}
                        </button>
                    </form>

                    {role === 'student' && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '28px 0 24px' }}>
                                <div style={{ flex: 1, height: 1, background: 'rgba(22,163,74,0.15)' }} />
                                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>NEW TO CAMPUSCONNECT?</span>
                                <div style={{ flex: 1, height: 1, background: 'rgba(22,163,74,0.15)' }} />
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <Link to="/register" style={{ color: 'var(--green-dark)', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
                                    Request an Account
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>
                    <Link to="/" style={{ color: 'var(--text-secondary)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        ← Back to Home
                    </Link>
                </p>
            </div>
        </div>
    );
}
