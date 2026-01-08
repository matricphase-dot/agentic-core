"use client";

import React from 'react';
import Link from 'next/link';
import {
    Users,
    Megaphone,
    TrendingUp,
    TrendingDown,
    Plus,
    FileText,
    ArrowUpRight,
    MessageSquare,
    Zap
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import styles from './Dashboard.module.css';

const chartData = [
    { name: 'Mon', signups: 120, campaigns: 45 },
    { name: 'Tue', signups: 150, campaigns: 52 },
    { name: 'Wed', signups: 200, campaigns: 48 },
    { name: 'Thu', signups: 180, campaigns: 61 },
    { name: 'Fri', signups: 250, campaigns: 55 },
    { name: 'Sat', signups: 210, campaigns: 40 },
    { name: 'Sun', signups: 230, campaigns: 38 },
];

const activityData = [
    { id: 1, text: "New campaign 'Winter Sale' launched successfully", time: "2 hours ago", type: "campaign" },
    { id: 2, text: "New user registered: sarah.j@example.com", time: "4 hours ago", type: "user" },
    { id: 3, text: "Waitlist notification sent to 1,200 leads", time: "6 hours ago", type: "marketing" },
    { id: 4, text: "Database optimization completed", time: "1 day ago", type: "system" },
    { id: 5, text: "Marketing engine updated to v2.4", time: "2 days ago", type: "system" },
];

export default function AdminDashboardPage() {
    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h1 className={styles.title}>Control Center</h1>
                <p className={styles.subtitle}>Welcome back, here's what's happening today.</p>
            </header>

            {/* Stats Overview */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statIcon}><Users size={20} /></div>
                        <div className={`${styles.statTrend} ${styles.trendUp}`}>
                            <TrendingUp size={14} /> +12%
                        </div>
                    </div>
                    <div className={styles.statLabel}>Total Users</div>
                    <div className={styles.statValue}>24,512</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statIcon} style={{ color: '#10b981', backgroundColor: '#ecfdf5' }}><Zap size={20} /></div>
                        <div className={`${styles.statTrend} ${styles.trendUp}`}>
                            <TrendingUp size={14} /> +5.2%
                        </div>
                    </div>
                    <div className={styles.statLabel}>Active Campaigns</div>
                    <div className={styles.statValue}>184</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statIcon} style={{ color: '#f59e0b', backgroundColor: '#fffbe6' }}><Megaphone size={20} /></div>
                        <div className={`${styles.statTrend} ${styles.trendDown}`}>
                            <TrendingDown size={14} /> -2%
                        </div>
                    </div>
                    <div className={styles.statLabel}>Ad Impressions</div>
                    <div className={styles.statValue}>1.2M</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statIcon} style={{ color: '#0ea5e9', backgroundColor: '#f0f9ff' }}><MessageSquare size={20} /></div>
                        <div className={`${styles.statTrend} ${styles.trendUp}`}>
                            <TrendingUp size={14} /> +24%
                        </div>
                    </div>
                    <div className={styles.statLabel}>Support Tickets</div>
                    <div className={styles.statValue}>42</div>
                </div>
            </div>

            {/* Charts & Activity */}
            <div className={styles.mainGrid}>
                <div className={styles.chartCard}>
                    <h3 className={styles.cardTitle}>Platform Growth</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="signups"
                                    stroke="#4f46e5"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorSignups)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.activityCard}>
                    <h3 className={styles.cardTitle}>Recent Activity</h3>
                    <div className={styles.activityList}>
                        {activityData.map((item) => (
                            <div key={item.id} className={styles.activityItem}>
                                <div className={styles.activityIndicator} />
                                <div className={styles.activityContent}>
                                    <div className={styles.activityText}>{item.text}</div>
                                    <div className={styles.activityTime}>{item.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <section>
                <h3 className={styles.cardTitle}>Quick Actions</h3>
                <div className={styles.actionsGrid}>
                    <Link href="/admin/marketing" className={styles.actionButton}>
                        <div className={styles.actionIcon}><Plus size={20} /></div>
                        <div>
                            <div className={styles.actionTitle}>New Campaign</div>
                            <div className={styles.actionDesc}>Launch a new marketing sequence</div>
                        </div>
                    </Link>
                    <Link href="/admin/outreach" className={styles.actionButton}>
                        <div className={styles.actionIcon} style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}><Zap size={20} /></div>
                        <div>
                            <div className={styles.actionTitle}>Run Outreach</div>
                            <div className={styles.actionDesc}>Start automated DM campaigns</div>
                        </div>
                    </Link>
                    <button className={styles.actionButton}>
                        <div className={styles.actionIcon} style={{ backgroundColor: '#fffbe6', color: '#f59e0b' }}><FileText size={20} /></div>
                        <div>
                            <div className={styles.actionTitle}>Generate Report</div>
                            <div className={styles.actionDesc}>Export system metrics to PDF</div>
                        </div>
                    </button>
                    <Link href="/admin/settings" className={styles.actionButton}>
                        <div className={styles.actionIcon} style={{ backgroundColor: '#f0f9ff', color: '#0ea5e9' }}><ArrowUpRight size={20} /></div>
                        <div>
                            <div className={styles.actionTitle}>System Update</div>
                            <div className={styles.actionDesc}>Check for engine updates</div>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
}
