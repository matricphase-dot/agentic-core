"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Loader2, ArrowLeft, Send, CheckCircle, XCircle, Clock,
    MessageSquare, AlertCircle, Shield, User, History
} from "lucide-react";
import styles from "../Support.module.css";
import { useToast } from "@/components/admin/FeedbackUI";

export default function TicketDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { showToast } = useToast();
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [replyMessage, setReplyMessage] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchTicket();
    }, [id]);

    const fetchTicket = async () => {
        try {
            const res = await fetch(`/api/support/tickets/${id}`);
            if (!res.ok) throw new Error("Failed");
            const data = await res.json();
            setTicket(data);
        } catch (error) {
            console.error(error);
            showToast("Error", "Could not load ticket details.", "error");
            router.push('/admin/support');
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            const res = await fetch(`/api/support/tickets/${id}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: replyMessage }),
            });
            if (!res.ok) throw new Error("Failed to send");

            showToast("Reply Sent", "Your message has been delivered to the user.", "success");
            setReplyMessage("");
            fetchTicket();
        } catch (error) {
            showToast("Error", "Failed to deliver reply.", "error");
        } finally {
            setSending(false);
        }
    };

    const updateStatus = async (status: string) => {
        try {
            const res = await fetch(`/api/support/tickets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error("Update failed");
            showToast("Status Updated", `Ticket is now marked as ${status.replace('_', ' ')}.`, "success");
            fetchTicket();
        } catch (error) {
            showToast("Error", "Failed to update ticket status.", "error");
        }
    };

    const updatePriority = async (priority: string) => {
        try {
            const res = await fetch(`/api/support/tickets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priority }),
            });
            if (!res.ok) throw new Error("Update failed");
            showToast("Priority Updated", `Ticket priority changed to ${priority}.`, "success");
            fetchTicket();
        } catch (error) {
            showToast("Error", "Failed to update priority.", "error");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="animate-spin text-indigo-600 mb-4 mx-auto" size={32} />
                <p className="text-gray-500 font-medium">Loading ticket details...</p>
            </div>
        </div>
    );

    if (!ticket) return null;

    return (
        <div className={styles.support}>
            <header className={styles.header}>
                <Link href="/admin/support" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-indigo-600 mb-4 transition-colors">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Support Inbox
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className={styles.title}>{ticket.subject}</h1>
                        <p className={styles.subtitle}>Viewing conversation history for user {ticket.email}</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                                {ticket.email.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">{ticket.email}</div>
                                <div className="text-xs text-gray-400">{new Date(ticket.createdAt).toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl text-gray-800 whitespace-pre-wrap text-sm leading-relaxed border border-gray-100">
                            {ticket.message}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <History size={18} className="text-indigo-500" />
                            <h3 className="font-bold text-gray-900">Conversation Timeline</h3>
                        </div>
                        <div className="space-y-6 relative before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                            {ticket.events?.length === 0 ? (
                                <p className="text-center text-sm text-gray-400 py-4">No events recorded yet.</p>
                            ) : (
                                ticket.events?.map((event: any) => (
                                    <div key={event.id} className="flex gap-4 relative">
                                        <div className="w-[20px] h-[20px] rounded-full bg-white border-2 border-indigo-400 flex items-center justify-center z-10">
                                            {event.eventType === 'created' && <CheckCircle size={10} className="text-green-500" />}
                                            {event.eventType === 'admin_replied' && <Send size={10} className="text-blue-500" />}
                                            {event.eventType === 'status_changed' && <Clock size={10} className="text-orange-500" />}
                                        </div>
                                        <div className="flex-1 bg-gray-50/50 p-4 rounded-xl border border-gray-100/50">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-xs uppercase tracking-wider text-gray-500">{event.eventType.replace('_', ' ')}</span>
                                                <span className="text-[10px] font-medium text-gray-400">{new Date(event.createdAt).toLocaleString()}</span>
                                            </div>
                                            <p className="text-gray-700 text-sm leading-relaxed">{event.message}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-md">
                        <div className="flex items-center gap-2 mb-6">
                            <MessageSquare size={18} className="text-indigo-600" />
                            <h3 className="font-bold text-gray-900 text-lg">Quick Reply</h3>
                        </div>
                        <form onSubmit={handleReply}>
                            <textarea
                                className="w-full p-4 border border-indigo-50 rounded-xl mb-4 h-40 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm leading-relaxed bg-indigo-50/20"
                                placeholder="Type your response to the user here..."
                                value={replyMessage}
                                onChange={e => setReplyMessage(e.target.value)}
                                required
                            />
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 font-bold text-sm transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                >
                                    {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-extrabold text-gray-400 mb-4 uppercase text-[10px] tracking-[0.1em]">Control Status</h3>
                        <div className="space-y-2">
                            {["open", "in_progress", "resolved", "closed"].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => updateStatus(s)}
                                    className={`w-full text-left px-4 py-3 rounded-xl capitalize text-sm font-semibold transition-all ${ticket.status === s
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    {s.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-extrabold text-gray-400 mb-4 uppercase text-[10px] tracking-[0.1em]">Impact Priority</h3>
                        <div className="space-y-2">
                            {["low", "normal", "high"].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => updatePriority(p)}
                                    className={`w-full text-left px-4 py-3 rounded-xl capitalize text-sm font-semibold transition-all ${ticket.priority === p
                                            ? 'bg-rose-500 text-white shadow-md'
                                            : 'text-gray-500 hover:bg-rose-50'
                                        }`}
                                >
                                    {p} Priority
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-indigo-900 p-6 rounded-2xl text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <Shield size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="bg-indigo-500/30 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                                <AlertCircle size={20} />
                            </div>
                            <h4 className="font-bold text-lg mb-1">Safety First</h4>
                            <p className="text-indigo-200 text-xs leading-relaxed">
                                Avoid sharing sensitive credentials. Direct users to the official knowledge base when possible.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
