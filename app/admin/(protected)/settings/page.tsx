"use client";

import React, { useState } from 'react';
import { Save, RefreshCcw, Shield, Globe, Mail, Zap } from 'lucide-react';
import styles from './Settings.module.css';
import { useToast } from '@/components/admin/FeedbackUI';

export default function SettingsPage() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            showToast("Settings Saved", "Your configuration has been updated successfully.", "success");
        }, 1000);
    };

    return (
        <div className={styles.settings}>
            <header className={styles.header}>
                <h1 className={styles.title}>System Settings</h1>
                <p className={styles.subtitle}>Configure your platform, integrations, and automation rules.</p>
            </header>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className="flex items-center gap-2">
                        <Globe size={20} className="text-indigo-500" />
                        <h2 className={styles.sectionTitle}>General Configuration</h2>
                    </div>
                    <p className={styles.sectionDesc}>Basic settings for your Resonate instance.</p>
                </div>
                <div className={styles.sectionContent}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Application Name</label>
                            <input type="text" className={styles.input} defaultValue="Resonate AI" />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Admin Email Allowlist (Comma separated)</label>
                            <input type="text" className={styles.input} defaultValue="resonate.admin8153@protonmail.com" />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className="flex items-center gap-2">
                        <Mail size={20} className="text-emerald-500" />
                        <h2 className={styles.sectionTitle}>SMTP Settings (Zoho/Gmail)</h2>
                    </div>
                    <p className={styles.sectionDesc}>Configure how automated emails are sent.</p>
                </div>
                <div className={styles.sectionContent}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={styles.formGroup}>
                            <label className={styles.label}>SMTP Host</label>
                            <input type="text" className={styles.input} defaultValue="smtp.zoho.com" />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>SMTP Port</label>
                            <input type="text" className={styles.input} defaultValue="587" />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>SMTP User</label>
                            <input type="text" className={styles.input} defaultValue="resonateteam@zohomail.com" />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>SMTP Password</label>
                            <input type="password" className={styles.input} defaultValue="••••••••••••" />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className="flex items-center gap-2">
                        <Zap size={20} className="text-amber-500" />
                        <h2 className={styles.sectionTitle}>Automation Webhooks</h2>
                    </div>
                    <p className={styles.sectionDesc}>Connect your marketing and outreach engines.</p>
                </div>
                <div className={styles.sectionContent}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Make.com Social Callback Secret</label>
                        <input type="text" className={styles.input} defaultValue="••••••••••••••••" />
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <button className={`${styles.btn} ${styles.btnSecondary}`}>
                    <RefreshCcw size={18} className="mr-2 inline" />
                    Reset
                </button>
                <button
                    onClick={handleSave}
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    disabled={loading}
                >
                    {loading ? "Saving..." : (
                        <>
                            <Save size={18} className="mr-2 inline" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
