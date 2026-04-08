import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, Users, CalendarDays, Trophy, Zap, ChevronRight, Star, Shield, BookOpen, Sparkles, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from './api';
const features = [
    { icon: <CalendarDays size={22} />, color: '#16a34a', label: 'Activity Management', desc: 'Browse and register for clubs, sports, and events all in one place.' },
    { icon: <Users size={22} />, color: '#2563eb', label: 'Real-Time Tracking', desc: 'Track your registrations and participation status in real time.' },
    { icon: <Shield size={22} />, color: '#7c3aed', label: 'Role-Based Access', desc: 'Separate admin and student dashboards with tailored features.' },
    { icon: <Zap size={22} />, color: '#d97706', label: 'Instant Notifications', desc: 'Get notified about updates, reminders, and activity approvals instantly.' },
    { icon: <Trophy size={22} />, color: '#db2777', label: 'Achievement Badges', desc: 'Earn recognition for active participation and milestone completion.' },
    { icon: <BookOpen size={22} />, color: '#0891b2', label: 'Admin Dashboard', desc: 'Create, manage, and monitor all campus activities from one panel.' },
];

const stats = [
    { value: '50+', label: 'Active Clubs' },
    { value: '2,400+', label: 'Students Enrolled' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '120+', label: 'Events Per Year' },
];

export default function Landing() {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        api.get('/activities').then(res => setActivities(res.data)).catch(console.error);
    }, []);

    const featured = activities.filter(a => a.featured).slice(0, 4);

    return (
        <div style={{ background: '#f0fdf4', minHeight: '100vh', color: 'var(--text-primary)' }}>
            {/* Green mesh blobs */}
            <div className="mesh-bg" aria-hidden>
                <div className="mesh-blob" style={{ width: 700, height: 700, background: '#22c55e', top: -200, left: -200 }} />
                <div className="mesh-blob" style={{ width: 500, height: 500, background: '#16a34a', bottom: 0, right: -100 }} />
                <div className="mesh-blob" style={{ width: 400, height: 400, background: '#4ade80', top: '40%', left: '35%' }} />
            </div>

            {/* Navbar */}
            <nav className="nav-landing">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(22,163,74,0.35)' }}>
                        <GraduationCap size={18} color="#fff" />
                    </div>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 16, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        CampusConnect
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => navigate('/login')} className="btn btn-ghost btn-sm">Sign In</button>
                    <button onClick={() => navigate('/register')} className="btn btn-primary btn-sm">Get Started <ArrowRight size={14} /></button>
                </div>
            </nav>

            {/* Hero */}
            <section className="landing-hero hero-grid" style={{ paddingTop: 96, paddingBottom: 64, position: 'relative' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px 0', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <div className="section-tag" style={{ justifyContent: 'center', margin: '0 auto 24px' }}>
                        <Sparkles size={12} /> Introducing CampusConnect v2.0
                    </div>
                    <h1 className="font-display" style={{ fontSize: 'clamp(38px,7vw,76px)', fontWeight: 900, lineHeight: 1.07, marginBottom: 24, letterSpacing: '-1.5px', color: 'var(--text-primary)' }}>
                        Your Campus Life,{' '}
                        <span style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Supercharged</span>
                    </h1>
                    <p style={{ fontSize: 18, lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 580, margin: '0 auto 40px', fontWeight: 400 }}>
                        The all-in-one platform to discover, join, and track extracurricular activities. Built for students who want to make the most of campus life.
                    </p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
                        <button onClick={() => navigate('/register')} className="btn btn-primary btn-lg">Start for Free <ArrowRight size={16} /></button>
                        <button onClick={() => navigate('/login')} className="btn btn-secondary btn-lg">Sign In to Dashboard</button>
                    </div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {featured.map((a, i) => (
                            <div key={a.id} className="activity-pill" style={{ animationDelay: `${i * 1.5}s` }}>
                                <div style={{ width: 8, height: 8, borderRadius: 4, background: a.color }} />
                                {a.title}
                                <span className={`badge badge-${a.category.toLowerCase()}`} style={{ fontSize: 10, padding: '2px 8px' }}>{a.category}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section style={{ padding: '0 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20 }}>
                    {stats.map(s => (
                        <div key={s.label} className="card-static" style={{ padding: '32px 24px', textAlign: 'center', background: 'linear-gradient(135deg,rgba(22,163,74,0.06),rgba(34,197,94,0.03))' }}>
                            <div className="stat-number">{s.value}</div>
                            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6, fontWeight: 500 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section style={{ padding: '0 24px 100px', maxWidth: 1100, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <div className="section-tag" style={{ display: 'inline-flex' }}>Everything you need</div>
                    <h2 className="font-display" style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>Built for the modern campus</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 14, fontSize: 16, maxWidth: 500, margin: '14px auto 0' }}>A complete platform connecting students with opportunities and giving admins full control.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
                    {features.map((f, i) => (
                        <div key={i} className="feature-card">
                            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.color}12`, border: `1px solid ${f.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: 16 }}>
                                {f.icon}
                            </div>
                            <h3 className="font-display" style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: 'var(--text-primary)' }}>{f.label}</h3>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Live activities preview */}
            <section style={{ padding: '0 24px 100px', maxWidth: 1100, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <div className="section-tag" style={{ display: 'inline-flex' }}>Live Activities</div>
                        <h2 className="font-display" style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 800, letterSpacing: '-0.5px' }}>Trending right now</h2>
                    </div>
                    <button onClick={() => navigate('/login')} className="btn btn-ghost" style={{ color: 'var(--green-dark)' }}>
                        View all <ChevronRight size={16} />
                    </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 18 }}>
                    {activities.slice(0, 4).map(a => {
                        const fillPct = Math.round((a.currentParticipants / a.maxParticipants) * 100);
                        const catEmoji = a.category === 'Club' ? '🎭' : a.category === 'Sport' ? '🏆' : '⚡';
                        return (
                            <div key={a.id} className="card" style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => navigate('/login')}>
                                <div style={{ height: 80, background: a.gradient, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '10px 14px' }}>
                                    {a.featured && <span style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)', backdropFilter: 'blur(6px)', color: '#d97706', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 3 }}><Star size={9} fill="currentColor" /> Featured</span>}
                                    <span className={`badge badge-${a.category.toLowerCase()}`}>{catEmoji} {a.category}</span>
                                </div>
                                <div style={{ padding: '14px 16px' }}>
                                    <h3 style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, color: 'var(--text-primary)' }}>{a.title}</h3>
                                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.description}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 7 }}>
                                        <span>{a.currentParticipants}/{a.maxParticipants} joined</span><span>{fillPct}%</span>
                                    </div>
                                    <div className="progress-track"><div className="progress-fill" style={{ width: `${fillPct}%` }} /></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Roles */}
            <section style={{ padding: '0 24px 100px', maxWidth: 1100, margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
                    {[
                        { emoji: '📚', role: 'For Students', color: '#16a34a', gradient: 'var(--grad-primary)', perks: ['Browse all activities & clubs', 'One-click registration', 'Track participation status', 'Get real-time notifications', 'Build your activity profile'], cta: 'Join as Student', path: '/register' },
                        { emoji: '🛡️', role: 'For Admins', color: '#2563eb', gradient: 'linear-gradient(135deg,#2563eb,#7c3aed)', perks: ['Full activity management', 'Create, edit, and delete events', 'View all student registrations', 'Update participation status', 'Send broadcast notifications'], cta: 'Admin Login', path: '/login' },
                    ].map(r => (
                        <div key={r.role} className="card-static" style={{ padding: 32, background: `linear-gradient(135deg,${r.color}08,${r.color}04)`, borderColor: `${r.color}20` }}>
                            <div style={{ fontSize: 42, marginBottom: 16 }}>{r.emoji}</div>
                            <h3 className="font-display" style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: 'var(--text-primary)' }}>{r.role}</h3>
                            <ul style={{ listStyle: 'none', marginBottom: 28 }}>
                                {r.perks.map(p => (
                                    <li key={p} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 14, color: 'var(--text-secondary)' }}>
                                        <CheckCircle size={14} style={{ color: r.color, flexShrink: 0 }} /> {p}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => navigate(r.path)} className="btn btn-primary" style={{ width: '100%', background: r.gradient, justifyContent: 'center' }}>
                                {r.cta} <ArrowRight size={15} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '0 24px 100px', maxWidth: 1100, margin: '0 auto' }}>
                <div style={{ background: 'linear-gradient(135deg,rgba(22,163,74,0.12),rgba(34,197,94,0.07))', border: '1px solid rgba(22,163,74,0.2)', borderRadius: 24, padding: 'clamp(40px,6vw,72px) 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%,rgba(22,163,74,0.12),transparent 60%)', pointerEvents: 'none' }} />
                    <div className="section-tag" style={{ display: 'inline-flex', marginBottom: 20 }}>Ready to get started?</div>
                    <h2 className="font-display" style={{ fontSize: 'clamp(26px,5vw,48px)', fontWeight: 900, marginBottom: 16, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
                        Join 2,400+ students today
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 17, maxWidth: 500, margin: '0 auto 36px' }}>
                        Sign up in seconds and start exploring everything your campus has to offer.
                    </p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/register')} className="btn btn-primary btn-lg">Create Free Account <ArrowRight size={16} /></button>
                        <button onClick={() => navigate('/login')} className="btn btn-secondary btn-lg">Sign In</button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid rgba(22,163,74,0.12)', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, background: 'rgba(255,255,255,0.7)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <GraduationCap size={16} style={{ color: 'var(--green)' }} />
                    <span style={{ fontWeight: 700, fontSize: 14, fontFamily: 'Plus Jakarta Sans', color: 'var(--green-dark)' }}>CampusConnect</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>© 2026 CampusConnect. Built for student excellence.</p>
            </footer>
        </div>
    );
}
