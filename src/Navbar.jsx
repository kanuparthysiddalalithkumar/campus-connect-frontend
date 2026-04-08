import { useState } from 'react';
import { Menu, Search } from 'lucide-react';
import { useAuth } from './AuthContext';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar({ setSidebarOpen }) {
    const { user } = useAuth();
    const [q, setQ] = useState('');

    return (
        <header style={{ position: 'sticky', top: 0, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 32px', background: 'rgba(240,253,244,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(22,163,74,0.12)', boxShadow: '0 1px 12px rgba(22,163,74,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <button onClick={() => setSidebarOpen(true)} id="menu-btn"
                    style={{ display: 'none', padding: 8, borderRadius: 10, border: '1px solid rgba(22,163,74,0.18)', background: 'rgba(22,163,74,0.07)', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    <Menu size={20} />
                </button>
                <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input value={q} onChange={e => setQ(e.target.value)}
                        placeholder="Search activities..."
                        className="input"
                        style={{ width: 260, paddingLeft: 38, height: 38, borderRadius: 12, fontSize: 13, background: '#fff' }} />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <NotificationDropdown />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px', background: 'rgba(22,163,74,0.07)', border: '1px solid rgba(22,163,74,0.18)', borderRadius: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#fff', boxShadow: '0 2px 8px rgba(22,163,74,0.3)' }}>
                        {user?.avatar || user?.name?.charAt(0)}
                    </div>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{user?.name?.split(' ')[0]}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</div>
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width:768px) { #menu-btn { display:flex !important; } #sidebar-close { display:flex !important; } }
      `}</style>
        </header>
    );
}
