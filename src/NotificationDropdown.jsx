import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

const icon = {
    success: <CheckCircle size={13} style={{ color: '#16a34a' }} />,
    info: <Info size={13} style={{ color: '#2563eb' }} />,
    warning: <AlertCircle size={13} style={{ color: '#d97706' }} />,
};

const relTime = iso => {
    const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
    const h = Math.floor((Date.now() - new Date(iso)) / 3600000);
    return d > 0 ? `${d}d ago` : h > 0 ? `${h}h ago` : 'Just now';
};

export default function NotificationDropdown() {
    const { notifications, unreadCount, markRead, markAllRead } = useAuth();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <button onClick={() => setOpen(o => !o)}
                style={{ position: 'relative', padding: 9, borderRadius: 12, border: '1px solid rgba(22,163,74,0.2)', background: 'rgba(22,163,74,0.06)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(22,163,74,0.12)'; e.currentTarget.style.color = 'var(--green-dark)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(22,163,74,0.06)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                <Bell size={18} />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </button>

            {open && (
                <div className="fade-in" style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 340, borderRadius: 20, overflow: 'hidden', background: '#ffffff', border: '1px solid rgba(22,163,74,0.18)', boxShadow: '0 16px 50px rgba(22,163,74,0.14), 0 2px 10px rgba(0,0,0,0.06)', zIndex: 60 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid rgba(22,163,74,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>Notifications</span>
                            {unreadCount > 0 && <span style={{ background: 'rgba(22,163,74,0.1)', color: 'var(--green-dark)', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{unreadCount} new</span>}
                        </div>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--green)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                <CheckCheck size={13} /> All read
                            </button>
                        )}
                    </div>

                    <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <Bell size={28} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
                                <p style={{ fontSize: 13 }}>No notifications yet</p>
                            </div>
                        ) : notifications.map(n => (
                            <div key={n.id} onClick={() => markRead(n.id)}
                                style={{ display: 'flex', gap: 12, padding: '12px 18px', cursor: 'pointer', borderBottom: '1px solid rgba(22,163,74,0.06)', background: n.isRead ? 'transparent' : 'rgba(22,163,74,0.04)', transition: 'background 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(22,163,74,0.06)'}
                                onMouseLeave={e => e.currentTarget.style.background = n.isRead ? 'transparent' : 'rgba(22,163,74,0.04)'}>
                                <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(22,163,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                                    {icon[n.type] || <Info size={13} />}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: 13, lineHeight: 1.55, color: n.isRead ? 'var(--text-muted)' : 'var(--text-primary)' }}>{n.message}</p>
                                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{relTime(n.createdAt)}</p>
                                </div>
                                {!n.isRead && <div style={{ width: 7, height: 7, borderRadius: 4, background: 'var(--green)', flexShrink: 0, marginTop: 6 }} />}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
