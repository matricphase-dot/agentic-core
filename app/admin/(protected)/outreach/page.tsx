"use client";

import { useState } from "react";
import { Loader2, Plus, Mail, Trash2, Users, Calendar, BarChart2, Search } from "lucide-react";
import styles from "./Outreach.module.css";

export default function OutreachDashboard() {
    const [activeTab, setActiveTab] = useState("leads");

    return (
        <div className={styles.outreach}>
            <header className={styles.header}>
                <h1 className={styles.title}>Outreach Control</h1>
                <p className={styles.subtitle}>Manage automated LinkedIn and Email sequences.</p>
            </header>

            <div className={styles.tabsContainer}>
                <div className={styles.tabList}>
                    <button
                        className={`${styles.tab} ${activeTab === "leads" ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab("leads")}
                    >
                        Leads Database
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === "sequences" ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab("sequences")}
                    >
                        Active Sequences
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === "events" ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab("events")}
                    >
                        Automation Log
                    </button>
                </div>
            </div>

            <div className={styles.content}>
                {activeTab === "leads" && <LeadsTable />}
                {activeTab === "sequences" && <SequencesList />}
                {activeTab === "events" && <EventsLog />}
            </div>
        </div>
    );
}

function LeadsTable() {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Prospects & Leads</h2>
                <div className="flex gap-2">
                    <button className={styles.btn} style={{ border: '1px solid var(--card-border)', padding: '0.5rem' }}>
                        <Search size={18} />
                    </button>
                    <button className={`${styles.btn} ${styles.btnPrimary}`}>
                        <Plus size={16} /> Import Leads
                    </button>
                </div>
            </div>
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}><Users size={24} /></div>
                <p className={styles.emptyText}>No leads found in the database. Start by importing a CSV or connecting your CRM.</p>
            </div>
        </div>
    );
}

function SequencesList() {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Workflow Automations</h2>
                <button className={`${styles.btn} ${styles.btnPrimary}`}>
                    <Plus size={16} /> Create Sequence
                </button>
            </div>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Sequence Name</th>
                            <th>Status</th>
                            <th>Enrolled</th>
                            <th>Last Run</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="font-medium">Onboarding Nurture</td>
                            <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>Active</span></td>
                            <td>1,240</td>
                            <td>2 hours ago</td>
                            <td><button className="text-slate-400 hover:text-slate-600">Edit</button></td>
                        </tr>
                        <tr>
                            <td className="font-medium">Cold Outreach #1</td>
                            <td><span className={`${styles.badge}`} style={{ backgroundColor: '#f1f5f9' }}>Draft</span></td>
                            <td>0</td>
                            <td>-</td>
                            <td><button className="text-slate-400 hover:text-slate-600">Edit</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function EventsLog() {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Recent Events</h2>
            </div>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Recipient</th>
                            <th>Status</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="flex items-center gap-2"><Mail size={14} className="text-indigo-500" /> Email Sent</td>
                            <td>john@example.com</td>
                            <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>Delivered</span></td>
                            <td>10:45 AM</td>
                        </tr>
                        <tr>
                            <td className="flex items-center gap-2"><Calendar size={14} className="text-orange-500" /> Call Scheduled</td>
                            <td>sarah.m@retail.co</td>
                            <td><span className={`${styles.badge} ${styles.badgeInfo}`}>Confirmed</span></td>
                            <td>9:12 AM</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
