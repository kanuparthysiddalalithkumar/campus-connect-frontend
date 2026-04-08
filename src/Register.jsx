import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { GraduationCap, Eye, EyeOff, UserPlus } from 'lucide-react';

const depts = ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Business Administration', 'Arts & Humanities', 'Physics', 'Mathematics', 'Other'];
const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG 1st Year', 'PG 2nd Year'];

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [f, setF] = useState({ name: '', email: '', password: '', confirm: '', department: '', year: '' });
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const s = k => e => setF(p => ({ ...p, [k]: e.target.value }));

    const submit = async ev => {
        ev.preventDefault();
        if (!f.name || !f.email || !f.password || !f.department || !f.year) { toast.error('Please fill all fields'); return; }
        if (f.password !== f.confirm) { toast.error('Passwords do not match'); return; }
        if (f.password.length < 6) { toast.error('Password must be 6+ characters'); return; }
        setLoading(true);
        try {
            await new Promise(r => setTimeout(r, 600));
            const u = await register(f.name, f.email, f.password, f.department, f.year);
            toast.success(`Welcome, ${u.name.split(' ')[0]}!`);
            navigate('/dashboard');
        } catch (err) { toast.error(err.response?.data?.message || err.message); }
        finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden' }}>
            <div className="mesh-bg" aria-hidden>
                <div className="mesh-blob" style={{ width: 500, height: 500, background: '#4ade80', top: -150, right: -100, opacity: 0.08 }} />
                <div className="mesh-blob" style={{ width: 400, height: 400, background: '#16a34a', bottom: -100, left: -100, opacity: 0.07 }} />
            </div>

            <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 15, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 6px 20px rgba(22,163,74,0.35)' }}>
                        <GraduationCap size={26} color="#fff" />
                    </div>
                    <h1 className="font-display" style={{ fontWeight: 900, fontSize: 24, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Join CampusConnect</h1>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Create your student account in seconds</p>
                </div>

                <div className="glass" style={{ padding: 28 }}>
                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div><label className="label">Full Name *</label><input className="input" placeholder="John Doe" value={f.name} onChange={s('name')} /></div>
                        <div><label className="label">Email *</label><input className="input" type="email" placeholder="you@campus.edu" value={f.email} onChange={s('email')} /></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label className="label">Department *</label>
                                <select className="input" value={f.department} onChange={s('department')} style={{ cursor: 'pointer' }}>
                                    <option value="" style={{ background: '#fff', color: '#0f2817' }}>Select...</option>
                                    {depts.map(d => <option key={d} value={d} style={{ background: '#fff', color: '#0f2817' }}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">Year *</label>
                                <select className="input" value={f.year} onChange={s('year')} style={{ cursor: 'pointer' }}>
                                    <option value="" style={{ background: '#fff', color: '#0f2817' }}>Select...</option>
                                    {years.map(y => <option key={y} value={y} style={{ background: '#fff', color: '#0f2817' }}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <label className="label">Password *</label>
                            <input className="input" type={show ? 'text' : 'password'} placeholder="Min. 6 characters" style={{ paddingRight: 44 }} value={f.password} onChange={s('password')} />
                            <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 14, bottom: 12, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                                {show ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <div><label className="label">Confirm Password *</label><input className="input" type="password" placeholder="Repeat password" value={f.confirm} onChange={s('confirm')} /></div>
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, marginTop: 4 }}>
                            {loading ? <div className="spinner" style={{ width: 18, height: 18, borderTopColor: '#fff' }} /> : <><UserPlus size={16} /> Create Account</>}
                        </button>
                    </form>
                    <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
                        Have an account? <Link to="/login" style={{ color: 'var(--green-dark)', fontWeight: 700 }}>Sign in</Link>
                    </p>
                </div>
                <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                    <Link to="/" style={{ color: 'var(--green-dark)', fontWeight: 600 }}>← Back to Home</Link>
                </p>
            </div>
        </div>
    );
}
