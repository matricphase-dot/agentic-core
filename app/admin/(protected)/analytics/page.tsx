"use client";

import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';
import { TrendingUp, TrendingDown, Users, Target, MousePointer, BarChart2 } from 'lucide-react';
import styles from './Analytics.module.css';

const engagementData = [
    { name: 'Mon', views: 4000, clicks: 2400 },
    { name: 'Tue', views: 3000, clicks: 1398 },
    { name: 'Wed', views: 2000, clicks: 9800 },
    { name: 'Thu', views: 2780, clicks: 3908 },
    { name: 'Fri', views: 1890, clicks: 4800 },
    { name: 'Sat', views: 2390, clicks: 3800 },
    { name: 'Sun', views: 3490, clicks: 4300 },
];

const conversionData = [
    { name: 'Week 1', rate: 12 },
    { name: 'Week 2', rate: 15 },
    { name: 'Week 3', rate: 11 },
    { name: 'Week 4', rate: 18 },
    { name: 'Week 5', rate: 22 },
];

export default function AnalyticsPage() {
    return (
        <div className={styles.analytics}>
            <header className={styles.header}>
                <h1 className={styles.title}>Analytics & Insights</h1>
                <p className={styles.subtitle}>Track your platform performance and user engagement.</p>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                    <div className={styles.statLabel}>Total Reach</div>
                    <div className={styles.statValue}>124.5k</div>
                    <div className={`${styles.statTrend} ${styles.trendUp}`}>
                        <TrendingUp size={14} /> +12.5%
                    </div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statLabel}>Engagements</div>
                    <div className={styles.statValue}>18,245</div>
                    <div className={`${styles.statTrend} ${styles.trendUp}`}>
                        <TrendingUp size={14} /> +8.2%
                    </div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statLabel}>Avg. Click Rate</div>
                    <div className={styles.statValue}>4.2%</div>
                    <div className={`${styles.statTrend} ${styles.trendDown}`}>
                        <TrendingDown size={14} /> -0.4%
                    </div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statLabel}>New Leads</div>
                    <div className={styles.statValue}>842</div>
                    <div className={`${styles.statTrend} ${styles.trendUp}`}>
                        <TrendingUp size={14} /> +24%
                    </div>
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Engagement Overview</h3>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={engagementData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="views" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="clicks" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Conversion Rate Trends</h3>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={conversionData}>
                                <defs>
                                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="rate" stroke="#6366f1" fillOpacity={1} fill="url(#colorRate)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
