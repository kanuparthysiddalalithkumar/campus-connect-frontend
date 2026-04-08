import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
            {/* Subtle green tinted blobs */}
            <div className="mesh-bg" aria-hidden>
                <div className="mesh-blob" style={{ width: 600, height: 600, background: '#22c55e', top: -200, left: -200 }} />
                <div className="mesh-blob" style={{ width: 400, height: 400, background: '#4ade80', bottom: 0, right: -100 }} />
                <div className="mesh-blob" style={{ width: 300, height: 300, background: '#16a34a', top: '40%', left: '50%' }} />
            </div>
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            <div className="main-content" style={{ position: 'relative', zIndex: 10 }}>
                <Navbar setSidebarOpen={setSidebarOpen} />
                <main style={{ padding: '28px 32px' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
