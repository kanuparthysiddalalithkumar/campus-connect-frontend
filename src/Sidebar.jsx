import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { LayoutDashboard, CalendarDays, ClipboardList, Settings, LogOut, GraduationCap, ShieldCheck, X } from 'lucide-react';

const studentNav = [
    { to: '/dashboard', icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
    { to: '/activities', icon: <CalendarDays size={17} />, label: 'Activities' },
    { to: '/my-activities', icon: <ClipboardList size={17} />, label: 'My Activities' },
    { to: '/profile', icon: <Settings size={17} />, label: 'Profile' },
];
const adminNav = [
    { to: '/dashboard', icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
    { to: '/activities', icon: <CalendarDays size={17} />, label: 'Activities' },
    { to: '/admin', icon: <ShieldCheck size={17} />, label: 'Admin Panel' },
    { to: '/profile', icon: <Settings size={17} />, label: 'Profile' },
];

export default function Sidebar({ open, setOpen }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const nav = user?.role === 'admin' ? adminNav : studentNav;

    return (
        <>
            {open && (
                <div onClick={() => setOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(15,40,23,0.35)', backdropFilter: 'blur(4px)', zIndex: 40 }} />
            )}
            <aside className={`sidebar${open ? ' open' : ''}`}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 16px', borderBottom: '1px solid rgba(22,163,74,0.12)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 14px rgba(22,163,74,0.35)' }}>
                            <GraduationCap size={18} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 14, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CampusConnect</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Activity Platform</div>
                        </div>
                    </div>
                    <button onClick={() => setOpen(false)} id="sidebar-close"
                        style={{ display: 'none', padding: 6, borderRadius: 8, border: 'none', background: 'rgba(22,163,74,0.08)', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <X size={16} />
                    </button>
                </div>

                {/* User pill */}
                <div style={{ margin: '14px 12px', padding: '12px 14px', background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.15)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: 13, color: '#fff' }}>
                        {user?.avatar || user?.name?.charAt(0)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.role === 'admin' ? '🛡 Administrator' : `📚 ${user?.year || 'Student'}`}</div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '4px 0', overflowY: 'auto' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', padding: '8px 22px 4px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Menu</p>
                    {nav.map(item => (
                        <NavLink key={item.to} to={item.to} end={item.to === '/dashboard'}
                            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                            onClick={() => setOpen(false)}>
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div style={{ padding: '12px', borderTop: '1px solid rgba(22,163,74,0.1)' }}>
                    <button onClick={() => { logout(); navigate('/'); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px', borderRadius: 12, border: '1px solid rgba(220,38,38,0.15)', background: 'rgba(220,38,38,0.04)', color: 'rgba(220,38,38,0.7)', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.1)'; e.currentTarget.style.color = '#dc2626'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.04)'; e.currentTarget.style.color = 'rgba(220,38,38,0.7)'; }}>
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
