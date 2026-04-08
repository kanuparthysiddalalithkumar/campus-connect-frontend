import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ClipboardList, Calendar, Clock, MapPin, ChevronRight, Filter } from 'lucide-react';

const statuses = ['All', 'REGISTERED', 'PARTICIPATED', 'COMPLETED'];

export default function MyActivities() {
    const { registrations } = useAuth();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    
    // Ensure we have an array
    const regs = registrations || [];
    const shown = filter === 'All' ? regs : regs.filter(r => r.status === filter);

    const counts = { All: regs.length, REGISTERED: 0, PARTICIPATED: 0, COMPLETED: 0 };
    regs.forEach(r => { if (counts[r.status] !== undefined) counts[r.status]++; });

    const formatStatus = (s) => s.charAt(0) + s.slice(1).toLowerCase();

    return (
        <div className="page-in" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div>
                <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 'clamp(20px,3vw,28px)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <ClipboardList size={22} style={{ color: 'var(--purple-light)' }} /> My Activities
                </h1>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Your registrations and participation history</p>
            </div>

            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 14 }}>
                {[
                    { label: 'Total Joined', val: counts.All, color: '#a78bfa' },
                    { label: 'Upcoming', val: counts.REGISTERED, color: '#fbbf24' },
                    { label: 'Participated', val: counts.PARTICIPATED, color: '#60a5fa' },
                    { label: 'Completed', val: counts.COMPLETED, color: '#34d399' },
                ].map(s => (
                    <div key={s.label} className="card-static" style={{ padding: '18px 20px', textAlign: 'center' }}>
                        <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Plus Jakarta Sans', color: s.color, marginBottom: 4 }}>{s.val}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Filter chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Filter size={14} style={{ color: 'var(--text-muted)' }} />
                {statuses.map(s => (
                    <button key={s} onClick={() => setFilter(s)} className={`chip${filter === s ? ' active' : ''}`}>
                        {s === 'All' ? s : formatStatus(s)}{s !== 'All' && counts[s] > 0 ? ` (${counts[s]})` : ''}
                    </button>
                ))}
            </div>

            {/* List */}
            {shown.length === 0 ? (
                <div className="card-static" style={{ padding: '56px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 14 }}>📋</div>
                    <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No activities found</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
                        {regs.length === 0 ? "You haven't joined any activities yet." : `No activities with "${formatStatus(filter)}" status.`}
                    </p>
                    <button onClick={() => navigate('/activities')} className="btn btn-primary">Browse Activities</button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {shown.map(reg => {
                        const act = reg.activity;
                        if (!act) return null;
                        return (
                            <div key={reg.id} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
                                onClick={() => navigate(`/activities/${act.id}`)}>
                                <div style={{ width: 48, height: 48, borderRadius: 14, background: act.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                                    {act.category === 'Club' ? '🎭' : act.category === 'Sport' ? '🏆' : '⚡'}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                                        <div>
                                            <h3 style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 6 }}>{act.title}</h3>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                                                {[
                                                    { icon: <Calendar size={11} />, txt: act.date },
                                                    { icon: <Clock size={11} />, txt: act.time },
                                                    { icon: <MapPin size={11} />, txt: act.location },
                                                ].map((d, i) => (
                                                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                                                        <span style={{ color: 'var(--purple-light)' }}>{d.icon}</span> {d.txt}
                                                    </span>
                                                ))}
                                            </div>
                                            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5 }}>Registered on {reg.registeredAt}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                                            <span className={`status-${reg.status.toLowerCase()}`}>{formatStatus(reg.status)}</span>
                                            <ChevronRight size={15} style={{ color: 'var(--text-muted)' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
