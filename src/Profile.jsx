import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from './api';
import toast from 'react-hot-toast';
import Spinner from './Spinner';
import { User, Mail, BookOpen, Calendar, Award, Edit2, Save, GraduationCap, Settings, X } from 'lucide-react';

export default function Profile() {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const { registrations } = useAuth();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'admin';

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await api.get('/activities');
                setActivities(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchActivities();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) return <div style={{ display: 'grid', placeItems: 'center', height: '60vh' }}><Spinner /></div>;

    const details = [
        { icon: <User size={14} />, label: 'Full Name', val: user?.name },
        { icon: <Mail size={14} />, label: 'Email', val: user?.email },
        { icon: <GraduationCap size={14} />, label: isAdmin ? 'Role' : 'Department', val: isAdmin ? 'Administrator' : user?.department || 'N/A' },
        { icon: <BookOpen size={14} />, label: isAdmin ? 'Access Level' : 'Year', val: isAdmin ? 'Full Admin Access' : user?.year || 'N/A' },
        { icon: <Calendar size={14} />, label: 'Member Since', val: user?.joinedAt || '2024' },
    ];

    const stats = isAdmin ? [
        { emoji: '📋', label: 'Activities', val: activities.length },
        { emoji: '🎭', label: 'Clubs', val: activities.filter(a => a.category === 'Club').length },
        { emoji: '🏆', label: 'Sports', val: activities.filter(a => a.category === 'Sport').length },
        { emoji: '⚡', label: 'Events', val: activities.filter(a => a.category === 'Event').length },
    ] : [
        { emoji: '📚', label: 'Department', val: user?.department?.split(' ')[0] || 'N/A' },
        { emoji: '📅', label: 'Year', val: user?.year || 'N/A' },
        { emoji: '🏅', label: 'Clubs Joined', val: registrations?.filter(r => r.activity?.category === 'Club').length || 0 },
        { emoji: '🔥', label: 'Total Joined', val: registrations?.length || 0 },
    ];

    const badges = [
        { emoji: '🌟', label: 'Early Adopter', desc: 'Joined the platform' },
        { emoji: '🏅', label: 'Go-Getter', desc: 'Registered for an activity' },
        { emoji: '🎯', label: 'Explorer', desc: 'Browsed 5+ activities' },
        { emoji: '🔥', label: 'Active Member', desc: 'Completed an activity' },
        { emoji: '📢', label: 'Contributor', desc: 'Attended a campus event' },
        { emoji: '💡', label: 'Innovator', desc: 'Joined a hackathon' },
    ];

    return (
        <div className="page-in" style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
                <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 'clamp(20px,3vw,26px)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Settings size={22} style={{ color: 'var(--purple-light)' }} /> My Profile
                </h1>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage your account and preferences</p>
            </div>

            {/* Profile card */}
            <div className="card-static" style={{ overflow: 'hidden' }}>
                <div style={{ height: 72, background: 'var(--grad-primary)', opacity: 0.32 }} />
                <div style={{ padding: '0 24px 24px', marginTop: -32 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22, color: '#fff', border: '3px solid var(--bg-base)', boxShadow: '0 8px 24px rgba(124,58,237,0.4)' }}>
                            {user?.avatar || user?.name?.charAt(0)}
                        </div>
                        <button onClick={editing ? () => { toast.success('Profile saved!'); setEditing(false); } : () => setEditing(true)}
                            className={`btn btn-sm ${editing ? 'btn-primary' : 'btn-secondary'}`} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {editing ? <><Save size={13} /> Save Profile</> : <><Edit2 size={13} /> Edit Profile</>}
                        </button>
                    </div>
                    {editing
                        ? <input className="input" value={name} onChange={e => setName(e.target.value)} style={{ maxWidth: 300, marginBottom: 6, fontWeight: 700, fontSize: 18 }} />
                        : <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 20, marginBottom: 4 }}>{user?.name}</h2>}
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>{user?.email}</p>
                    <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'capitalize', background: isAdmin ? 'rgba(244,63,94,0.12)' : 'rgba(124,58,237,0.12)', color: isAdmin ? '#f87171' : 'var(--purple-light)', border: `1px solid ${isAdmin ? 'rgba(244,63,94,0.25)' : 'rgba(124,58,237,0.25)'}` }}>
                        {isAdmin ? '🛡️ Administrator' : '📚 Student'}
                    </span>
                </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12 }}>
                {stats.map(s => (
                    <div key={s.label} className="card-static" style={{ padding: '18px', textAlign: 'center' }}>
                        <div style={{ fontSize: 24, marginBottom: 6 }}>{s.emoji}</div>
                        <div style={{ fontWeight: 800, fontSize: 18, fontFamily: 'Plus Jakarta Sans', color: 'var(--text-primary)', marginBottom: 3 }}>{s.val}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Account details */}
            <div className="card-static" style={{ padding: 24 }}>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 15, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <User size={15} style={{ color: 'var(--purple-light)' }} /> Account Details
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {details.map((d, i) => (
                        <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < details.length - 1 ? '1px solid var(--border)' : 'none' }}>
                            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(124,58,237,0.1)', color: 'var(--purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {d.icon}
                            </div>
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>{d.label}</p>
                                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{d.val}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Achievements */}
            <div className="card-static" style={{ padding: 24 }}>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 15, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Award size={15} style={{ color: '#fbbf24' }} /> Achievements
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12 }}>
                    {badges.map(b => (
                        <div key={b.label} style={{ textAlign: 'center', padding: '16px 12px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', transition: 'all 0.2s', cursor: 'default' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; e.currentTarget.style.background = 'rgba(124,58,237,0.06)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>{b.emoji}</div>
                            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, color: 'var(--text-primary)' }}>{b.label}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
