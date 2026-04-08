import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import api from './api';
import ActivityCard from './ActivityCard';
import Spinner from './Spinner';

const cats = ['All', 'Club', 'Sport', 'Event'];

export default function Activities() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState('');
    const [cat, setCat] = useState('All');
    const [sort, setSort] = useState('featured');

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await api.get('/activities');
                setActivities(res.data);
            } catch (err) {
                console.error('Failed to fetch activities', err);
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

    const filtered = activities
        .filter(a => {
            if (cat !== 'All' && a.category !== cat) return false;
            const lq = q.toLowerCase();
            return !lq || a.title.toLowerCase().includes(lq) || a.description.toLowerCase().includes(lq) || (a.tags && a.tags.some(t => t.toLowerCase().includes(lq)));
        })
        .sort((a, b) => {
            if (sort === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
            if (sort === 'date') return new Date(a.date) - new Date(b.date);
            if (sort === 'popular') return b.currentParticipants - a.currentParticipants;
            return 0;
        });

    if (loading) return <div style={{ display: 'grid', placeItems: 'center', height: '60vh' }}><Spinner /></div>;

    return (
        <div className="page-in" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 'clamp(20px,3vw,28px)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Sparkles size={22} style={{ color: 'var(--purple-light)' }} /> All Activities
                    </h1>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> of {activities.length} activities
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                    <SlidersHorizontal size={14} style={{ color: 'var(--text-muted)' }} />
                    <select value={sort} onChange={e => setSort(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        <option value="featured" style={{ background: '#0e0e2e' }}>Featured First</option>
                        <option value="date" style={{ background: '#0e0e2e' }}>By Date</option>
                        <option value="popular" style={{ background: '#0e0e2e' }}>Most Popular</option>
                    </select>
                </div>
            </div>

            {/* Search */}
            <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input className="input" placeholder="Search by title, description or tag..."
                    value={q} onChange={e => setQ(e.target.value)}
                    style={{ paddingLeft: 44, borderRadius: 14, fontSize: 14 }} />
            </div>

            {/* Chips */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {cats.map(c => (
                    <button key={c} onClick={() => setCat(c)} className={`chip${cat === c ? ' active' : ''}`}>
                        {c === 'All' ? '🌟 All' : c === 'Club' ? '🎭 Clubs' : c === 'Sport' ? '🏆 Sports' : '⚡ Events'}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="card-static" style={{ padding: '60px 32px', textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 14 }}>🔍</div>
                    <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>No activities found</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Try different search terms or change the filter.</p>
                    <button onClick={() => { setQ(''); setCat('All'); }} className="btn btn-secondary">Clear Filters</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 18 }}>
                    {filtered.map(a => <ActivityCard key={a.id} activity={a} />)}
                </div>
            )}
        </div>
    );
}
