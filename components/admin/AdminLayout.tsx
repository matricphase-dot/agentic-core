"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminLayout.module.css';
import {
    LayoutDashboard,
    Megaphone,
    Users,
    HelpCircle,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Search,
    Bell,
    Settings,
    Shield
} from 'lucide-react';

// Simplified cn since we don't have clsx/tailwind-merge ready in the environment yet
// and I want to avoid errors if they are not yet installed correctly.
// But I'll use them if I'm sure. I'll stick to template literals if unsure.
function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Marketing', href: '/admin/marketing', icon: Megaphone },
        { name: 'Outreach', href: '/admin/outreach', icon: Users },
        { name: 'Analytics', href: '/admin/analytics', icon: LayoutDashboard }, // Placeholder icon
        { name: 'Support', href: '/admin/support', icon: HelpCircle },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    const handleSignOut = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        window.location.href = '/admin/login';
    };

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    const activeItem = menuItems.find(m => m.href === pathname) || { name: 'Overview' };

    return (
        <div className={styles.layout}>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div className={styles.overlay} onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={cn(styles.sidebar, isSidebarOpen && styles.sidebarOpen)}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logoIcon}>
                        <Shield size={20} />
                    </div>
                    <span className={styles.logoText}>Resonate</span>
                </div>

                <nav className={styles.nav}>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    styles.navItem,
                                    isActive && styles.navItemActive
                                )}
                            >
                                <Icon size={18} />
                                <span>{item.name}</span>
                                {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.userProfile}>
                        <div className={styles.userAvatar}>JD</div>
                        <div className={styles.userMeta}>
                            <span className={styles.userName}>Admin Admin</span>
                            <span className={styles.userRole}>Super Admin</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {/* Topbar */}
                <header className={styles.topbar}>
                    <div className={styles.topbarLeft}>
                        <button
                            className={styles.mobileMenuToggle}
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        <div className={styles.breadcrumbs}>
                            <span style={{ opacity: 0.5 }}>Admin</span>
                            <ChevronRight size={14} style={{ opacity: 0.3 }} />
                            <span className={styles.breadcrumbCurrent}>{activeItem.name}</span>
                        </div>
                    </div>

                    <div className={styles.topbarRight}>
                        <button style={{ padding: '0.5rem', color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                            <Search size={20} />
                        </button>
                        <button style={{ padding: '0.5rem', color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative' }}>
                            <Bell size={20} />
                            <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', backgroundColor: '#6366f1', borderRadius: '50%', border: '2px solid white' }}></span>
                        </button>
                        <div style={{ width: '1px', height: '1.5rem', backgroundColor: '#e2e8f0', margin: '0 0.5rem' }}></div>
                        <button onClick={handleSignOut} className={styles.signOutButton}>
                            <LogOut size={18} />
                            <span style={{ marginLeft: '0.5rem' }}>Sign Out</span>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div className={styles.pageContent}>
                    <div className={styles.contentWrapper}>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
