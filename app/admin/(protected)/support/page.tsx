"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Search, Filter, MessageSquare, BookOpen, ChevronRight, Clock, User } from "lucide-react";
import styles from "./Support.module.css";
import KBManager from "./KBManager";
import { useToast } from "@/components/admin/FeedbackUI";

export default function SupportDashboard() {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'tickets' | 'kb'>('tickets');
    const [tickets, setTickets] = useState<any[]>([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeTab === 'tickets') {
            fetchTickets();
        }
    }, [activeTab, filter]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/support/tickets?status=${filter}`);
            if (!res.ok) throw new Error("Failed to fetch tickets");
            const data = await res.json();
            setTickets(data);
        } catch (error) {
            console.error(error);
            showToast("Error", "Could not load support tickets.", "error");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'open': return styles.badgeOpen;
            case 'in_progress': return styles.badgeInProgress;
            case 'resolved': return styles.badgeResolved;
            case 'closed': return styles.badgeClosed;
            default: return "";
        }
    };

    return (
        <div className={styles.support}>
            <header className={styles.header}>
                <h1 className={styles.title}>Support Engine</h1>
                <p className={styles.subtitle}>Manage customer inquiries, tickets, and knowledge base articles.</p>
            </header>

            <nav className={styles.tabs}>
                <button
                    onClick={() => setActiveTab('tickets')}
                    className={`${styles.tab} ${activeTab === 'tickets' ? styles.tabActive : ''}`}
                >
                    <MessageSquare size={18} className="inline mr-2" />
                    Tickets Inbox
                </button>
                <button
                    onClick={() => setActiveTab('kb')}
                    className={`${styles.tab} ${activeTab === 'kb' ? styles.tabActive : ''}`}
                >
                    <BookOpen size={18} className="inline mr-2" />
                    Knowledge Base
                </button>
            </nav>

            {activeTab === 'kb' ? (
                <KBManager />
            ) : (
                <>
                    <div className={styles.filters}>
                        {["all", "open", "in_progress", "resolved", "closed"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`${styles.filterBtn} ${filter === status ? styles.filterBtnActive : ''}`}
                            >
                                {status.replace("_", " ")}
                            </button>
                        ))}
                    </div>

                    <div className={styles.tableCard}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>Subject</th>
                                    <th className={styles.th}>User</th>
                                    <th className={styles.th}>Status</th>
                                    <th className={styles.th}>Priority</th>
                                    <th className={styles.th}>Date</th>
                                    <th className={styles.th}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className={styles.empty}>
                                            <Loader2 className="animate-spin inline mr-2" />
                                            Loading tickets...
                                        </td>
                                    </tr>
                                ) : tickets.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className={styles.empty}>
                                            <div className="mb-2"><Search size={40} className="mx-auto opacity-20" /></div>
                                            No tickets found for this filter.
                                        </td>
                                    </tr>
                                ) : (
                                    tickets.map((ticket) => (
                                        <tr key={ticket.id} className={styles.tr}>
                                            <td className={styles.td}>
                                                <div className="font-semibold">{ticket.subject}</div>
                                                <div className="text-xs text-gray-400 mt-1 flex items-center">
                                                    <Clock size={12} className="mr-1" />
                                                    ID: {ticket.id.substring(0, 8)}...
                                                </div>
                                            </td>
                                            <td className={styles.td}>
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3 text-xs font-bold">
                                                        {ticket.email.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="text-xs">{ticket.email}</div>
                                                </div>
                                            </td>
                                            <td className={styles.td}>
                                                <span className={`${styles.badge} ${getStatusBadgeClass(ticket.status)}`}>
                                                    {ticket.status.replace("_", " ")}
                                                </span>
                                            </td>
                                            <td className={styles.td}>
                                                <div className={styles.priority}>
                                                    <div className={`${styles.priorityDot} ${ticket.priority === 'high' ? styles.priorityHigh :
                                                            ticket.priority === 'medium' ? styles.priorityMedium :
                                                                styles.priorityLow
                                                        }`} />
                                                    <span className="capitalize">{ticket.priority}</span>
                                                </div>
                                            </td>
                                            <td className={styles.td}>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className={styles.td}>
                                                <Link href={`/admin/support/${ticket.id}`} className={styles.viewLink}>
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
