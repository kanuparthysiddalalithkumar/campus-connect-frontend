import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Calendar, Users, ArrowUpRight, Star } from 'lucide-react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

export default function ActivityCard({ activity: a }) {
    const { user, isRegistered, registerForActivity } = useAuth();
    const navigate = useNavigate();
    const registered = isRegistered(a.id);
    const fillPct = Math.min(100, Math.round((a.currentParticipants / a.maxParticipants) * 100));
    const catEmoji = a.category === 'Club' ? '🎭' : a.category === 'Sport' ? '🏆' : '⚡';

    const handleReg = e => {
        e.stopPropagation();
        if (!user) { navigate('/login'); return; }
        if (user.role === 'admin') { toast.error('Admins cannot register for activities'); return; }
        if (registered) { toast('Already registered!', { icon: '✅' }); return; }
        registerForActivity(a.id);
        toast.success(`Registered for ${a.title}!`);
    };

    return (
        <div className="card" style={{ overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }} onClick={() => navigate(`/activities/${a.id}`)}>
            {/* Banner */}
            <div style={{ height: 100, background: a.gradient, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '10px 14px', flexShrink: 0 }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)' }} />
                {a.featured && (
                    <span style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(245,158,11,0.22)', border: '1px solid rgba(245,158,11,0.4)', backdropFilter: 'blur(8px)', color: '#fbbf24', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 8 }}>
                        <Star size={9} fill="currentColor" /> Featured
                    </span>
                )}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span className={`badge badge-${a.category.toLowerCase()}`}>{catEmoji} {a.category}</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{fillPct}% full</span>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                    <h3 style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3 }}>{a.title}</h3>
                    <p className="truncate-2" style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{a.description}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {[
                        { icon: <Calendar size={11} />, text: `${a.date} · ${a.time}` },
                        { icon: <MapPin size={11} />, text: a.location },
                        { icon: <Users size={11} />, text: `${a.currentParticipants}/${a.maxParticipants} participants` },
                    ].map((r, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                            <span style={{ color: 'var(--purple-light)', flexShrink: 0 }}>{r.icon}</span> {r.text}
                        </div>
                    ))}
                </div>

                <div>
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${fillPct}%`, background: fillPct > 80 ? 'linear-gradient(90deg,#f43f5e,#ec4899)' : a.gradient || 'var(--grad-primary)' }} />
                    </div>
                </div>

                {a.tags && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {a.tags.slice(0, 3).map(t => (
                            <span key={t} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>#{t}</span>
                        ))}
                    </div>
                )}

                <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                    {user?.role !== 'admin' && (
                        <button onClick={handleReg} style={{ flex: 1, padding: '8px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none', background: registered ? 'rgba(16,185,129,0.12)' : 'var(--grad-primary)', color: registered ? '#34d399' : '#fff', boxShadow: registered ? 'none' : '0 4px 15px rgba(124,58,237,0.3)', transition: 'all 0.2s' }}>
                            {registered ? '✓ Registered' : 'Register Now'}
                        </button>
                    )}
                    <button onClick={e => { e.stopPropagation(); navigate(`/activities/${a.id}`); }}
                        style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <ArrowUpRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
