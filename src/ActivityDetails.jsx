import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { MapPin, Clock, Calendar, Users, ArrowLeft, Tag, UserCheck, Star, Share2 } from 'lucide-react';
import Spinner from './Spinner';

export default function ActivityDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isRegistered, registerForActivity } = useAuth();
    const [a, setActivity] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/activities/${id}`);
                setActivity(res.data);
                
                // Fetch related (for now we filter after fetching all, or we could have a related API)
                const allRes = await api.get('/activities');
                setRelated(allRes.data.filter(x => x.id !== parseInt(id) && x.category === res.data.category).slice(0, 3));
            } catch (err) {
                console.error('Failed to fetch activity', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div style={{ display: 'grid', placeItems: 'center', height: '60vh' }}><Spinner /></div>;

    if (!a) return (
        <div className="page-in" style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>😕</div>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 22, marginBottom: 8 }}>Activity Not Found</h2>
            <button onClick={() => navigate('/activities')} className="btn btn-primary" style={{ marginTop: 12 }}>Back to Activities</button>
        </div>
    );

    const registered = isRegistered(id);
    const fillPct = Math.min(100, Math.round((a.currentParticipants / a.maxParticipants) * 100));
    const catEmoji = a.category === 'Club' ? '🎭' : a.category === 'Sport' ? '🏆' : '⚡';

    const handleRegister = async () => {
        if (!user) { navigate('/login'); return; }
        if (user.role === 'admin') { toast.error('Admins cannot register for activities'); return; }
        if (registered) { toast('Already registered!', { icon: '✅' }); return; }
        const success = await registerForActivity(id);
        if (success) {
            toast.success(`Registered for "${a.title}"!`);
            // Refresh activity data to show updated participant count
            const res = await api.get(`/activities/${id}`);
            setActivity(res.data);
        } else {
            toast.error('Registration failed. Please try again.');
        }
    };

    return (
        <div className="page-in" style={{ maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 22 }}>
            <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start', gap: 6 }}>
                <ArrowLeft size={15} /> Back
            </button>

            {/* Hero banner */}
            <div style={{ height: 200, borderRadius: 20, background: a.gradient, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '20px 24px', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.55),transparent)' }} />
                {a.featured && (
                    <span style={{ position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(245,158,11,0.25)', border: '1px solid rgba(245,158,11,0.45)', backdropFilter: 'blur(10px)', color: '#fbbf24', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 10 }}>
                        <Star size={11} fill="currentColor" /> Featured
                    </span>
                )}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 6, fontWeight: 500 }}>{catEmoji} {a.category}</p>
                    <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 'clamp(20px,3.5vw,30px)', color: '#fff', lineHeight: 1.2 }}>{a.title}</h1>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 20, alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* About */}
                    <div className="card-static" style={{ padding: 24 }}>
                        <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 15, marginBottom: 12 }}>About this Activity</h2>
                        <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)' }}>{a.description}</p>
                        {a.tags?.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
                                {a.tags.map(tag => (
                                    <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, padding: '4px 12px', borderRadius: 20, background: 'rgba(124,58,237,0.1)', color: 'var(--purple-light)', border: '1px solid rgba(124,58,237,0.2)' }}>
                                        <Tag size={10} /> {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Capacity */}
                    <div className="card-static" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', gap: 7 }}>
                                <Users size={15} style={{ color: 'var(--purple-light)' }} /> Capacity
                            </h2>
                            <span style={{ fontSize: 13, fontWeight: 700, color: fillPct > 80 ? '#f43f5e' : '#10b981' }}>{fillPct}% filled</span>
                        </div>
                        <div className="progress-track" style={{ height: 8 }}>
                            <div className="progress-fill" style={{ width: `${fillPct}%`, background: fillPct > 80 ? 'linear-gradient(90deg,#f43f5e,#ec4899)' : a.gradient }} />
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                            {a.currentParticipants} registered · {a.maxParticipants - a.currentParticipants} spots remaining
                        </p>
                    </div>

                    {/* Related */}
                    {related.length > 0 && (
                        <div>
                            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 15, marginBottom: 12 }}>More {a.category}s</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
                                {related.map(r => (
                                    <div key={r.id} className="card" style={{ padding: '14px 16px', cursor: 'pointer' }} onClick={() => navigate(`/activities/${r.id}`)}>
                                        <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{r.title}</p>
                                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.date} · {r.location}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Details sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div className="card-static" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 14, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>Event Details</h3>
                        {[
                            { icon: <Calendar size={14} />, label: 'Date', val: a.date },
                            { icon: <Clock size={14} />, label: 'Time', val: a.time },
                            { icon: <MapPin size={14} />, label: 'Venue', val: a.location },
                            { icon: <Users size={14} />, label: 'Capacity', val: `${a.currentParticipants}/${a.maxParticipants}` },
                        ].map(item => (
                            <div key={item.label} style={{ display: 'flex', gap: 12 }}>
                                <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(124,58,237,0.12)', color: 'var(--purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {item.icon}
                                </div>
                                <div>
                                    <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>{item.label}</p>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {user?.role !== 'admin' && (
                        <button onClick={handleRegister} className="btn" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 14, background: registered ? 'rgba(16,185,129,0.12)' : a.gradient, color: registered ? '#34d399' : '#fff', border: registered ? '1px solid rgba(16,185,129,0.3)' : 'none', boxShadow: registered ? 'none' : '0 8px 24px rgba(124,58,237,0.3)' }}>
                            <UserCheck size={16} /> {registered ? 'Already Registered ✓' : 'Register Now'}
                        </button>
                    )}

                    <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied!'); }} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                        <Share2 size={14} /> Share Activity
                    </button>
                </div>
            </div>
        </div>
    );
}
