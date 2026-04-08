import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import api from './api';
import ActivityCard from './ActivityCard';
import { TrendingUp, ArrowUpRight, Star, ChevronRight, Activity, Users, CheckCircle, Clock, Calendar } from 'lucide-react';
import Spinner from './Spinner';

const Stat = ({ icon, label, value, sub, color, pulse }) => (
    <div className="stat-card" style={{ '--dot-color': color }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, borderRadius: '18px 18px 0 0', background: color }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ padding: 10, borderRadius: 12, background: 'rgba(255,255,255,0.06)', color }}>{icon}</div>
            {pulse && <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: 'rgba(16,185,129,0.12)', color: '#34d399', fontWeight: 700 }}>● LIVE</span>}
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Plus Jakarta Sans', marginBottom: 4 }}>{value}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{sub}</div>}
    </div>
);

export default function Dashboard() {
    const { user, registrations } = useAuth();
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'admin';
    const myRegs = registrations || [];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const actRes = await api.get('/activities');
                setActivities(actRes.data);
                if (isAdmin) {
                    const usrRes = await api.get('/users');
                    setUsers(usrRes.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isAdmin]);

    if (loading) return <div style={{ display: 'grid', placeItems: 'center', height: '60vh' }}><Spinner /></div>;

    const featured = activities.filter(a => a.featured);
    const studentsCount = users.filter(u => u.role === 'STUDENT' || u.role === 'student').length;
    const totalRegistrations = activities.reduce((acc, a) => acc + a.currentParticipants, 0);
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

    const stats = isAdmin ? [
        { icon: <Activity size={20} />, label: 'Total Activities', value: activities.length, sub: 'All categories', color: '#a78bfa' },
        { icon: <Users size={20} />, label: 'Enrolled Students', value: studentsCount, sub: 'Active this semester', color: '#34d399', pulse: true },
        { icon: <CheckCircle size={20} />, label: 'Registrations', value: totalRegistrations, sub: 'All time', color: '#60a5fa' },
        { icon: <Star size={20} />, label: 'Featured', value: featured.length, sub: 'Highlighted events', color: '#fbbf24' },
    ] : [
        { icon: <Calendar size={20} />, label: 'Joined Activities', value: myRegs.length, sub: 'Total registrations', color: '#a78bfa' },
        { icon: <CheckCircle size={20} />, label: 'Completed', value: myRegs.filter(r => r.status === 'COMPLETED').length, sub: 'Finished events', color: '#34d399' },
        { icon: <Clock size={20} />, label: 'Upcoming', value: myRegs.filter(r => r.status === 'REGISTERED').length, sub: 'Registered & waiting', color: '#60a5fa' },
        { icon: <TrendingUp size={20} />, label: 'Participation', value: myRegs.length ? Math.round((myRegs.filter(r => r.status !== 'REGISTERED').length / myRegs.length) * 100) + '%' : '0%', sub: 'Activity rate', color: '#fbbf24' },
    ];

    return (
        <div className="page-in" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Hero */}
            <div style={{ padding: '28px 32px', borderRadius: 20, background: 'linear-gradient(135deg,rgba(124,58,237,0.14),rgba(79,70,229,0.08))', border: '1px solid rgba(124,58,237,0.18)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: -20, top: -40, width: 200, height: 200, background: 'radial-gradient(circle,rgba(124,58,237,0.15),transparent)', borderRadius: '50%' }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, position: 'relative' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <span style={{ fontSize: 22 }}>{isAdmin ? '🛡️' : '👋'}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: 'rgba(124,58,237,0.18)', color: 'var(--purple-light)', border: '1px solid rgba(124,58,237,0.25)' }}>
                                {isAdmin ? 'Administrator' : user?.year || 'Student'}
                            </span>
                        </div>
                        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 'clamp(22px,3vw,32px)', marginBottom: 8, letterSpacing: '-0.5px' }}>
                            {greeting}, {user?.name?.split(' ')[0]}!
                        </h1>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                            {isAdmin
                                ? `Managing ${activities.length} activities · ${studentsCount} students enrolled`
                                : `${myRegs.filter(r => r.status === 'REGISTERED').length} upcoming · ${activities.length - myRegs.length} activities to explore`}
                        </p>
                    </div>
                    <button onClick={() => navigate(isAdmin ? '/admin' : '/activities')} className="btn btn-primary">
                        {isAdmin ? 'Manage Activities' : 'Browse All'} <ArrowUpRight size={15} />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
                {stats.map((s, i) => <Stat key={i} {...s} />)}
            </div>

            {/* Main content */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 310px', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 17, display: 'flex', alignItems: 'center', gap: 7 }}>
                            <Star size={16} style={{ color: '#fbbf24' }} fill="#fbbf24" /> Featured Activities
                        </h2>
                        <button onClick={() => navigate('/activities')} className="btn btn-ghost btn-sm" style={{ color: 'var(--purple-light)' }}>
                            View all <ChevronRight size={14} />
                        </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: 16 }}>
                        {featured.map(a => <ActivityCard key={a.id} activity={a} />)}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 17, display: 'flex', alignItems: 'center', gap: 7 }}>
                        <TrendingUp size={16} style={{ color: '#60a5fa' }} /> {isAdmin ? 'By Category' : 'Recent Activity'}
                    </h2>
                    <div className="card-static" style={{ padding: 20 }}>
                        {isAdmin ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {['Club', 'Sport', 'Event'].map(cat => {
                                    const cnt = activities.filter(a => a.category === cat).length;
                                    const pct = activities.length ? Math.round((cnt / activities.length) * 100) : 0;
                                    const clr = { Club: '#a78bfa', Sport: '#34d399', Event: '#f472b6' }[cat];
                                    const emo = { Club: '🎭', Sport: '🏆', Event: '⚡' }[cat];
                                    return (
                                        <div key={cat}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{emo} {cat}s</span>
                                                <span style={{ fontSize: 13, fontWeight: 700, color: clr }}>{cnt}</span>
                                            </div>
                                            <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%`, background: clr }} /></div>
                                        </div>
                                    );
                                })}
                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 4 }}>
                                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 12 }}>Top Activities</p>
                                    {[...activities].sort((a, b) => b.currentParticipants - a.currentParticipants).slice(0, 4).map((a, i) => (
                                        <div key={a.id} onClick={() => navigate(`/activities/${a.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-muted)', width: 18 }}>#{i + 1}</span>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</p>
                                                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.currentParticipants} joined</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : myRegs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '24px 0' }}>
                                <Calendar size={28} style={{ margin: '0 auto 10px', opacity: 0.25 }} />
                                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>No activities joined yet</p>
                                <button onClick={() => navigate('/activities')} className="btn btn-primary btn-sm">Explore Now</button>
                            </div>
                        ) : myRegs.slice(0, 5).map(reg => {
                            const act = reg.activity;
                            if (!act) return null;
                            return (
                                <div key={reg.id} onClick={() => navigate(`/activities/${act.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    <div style={{ width: 34, height: 34, borderRadius: 10, background: act.gradient || '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                                        {act.category === 'Club' ? '🎭' : act.category === 'Sport' ? '🏆' : '⚡'}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act.title}</p>
                                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{act.date}</p>
                                    </div>
                                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>{reg.status}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
