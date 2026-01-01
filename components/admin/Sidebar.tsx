
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Rocket,
    Mail,
    LifeBuoy,
    Settings,
    ShieldCheck,
    LogOut,
    ChevronRight
} from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Terminal", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Marketing", href: "/admin/marketing", icon: <Rocket size={20} /> },
        { name: "Outreach", href: "/admin/outreach", icon: <Mail size={20} /> },
        { name: "Support", href: "/admin/support", icon: <LifeBuoy size={20} /> },
        { name: "Identity", href: "/admin/details", icon: <ShieldCheck size={20} /> },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-72 bg-slate-900 border-r border-white/5 flex flex-col z-50">
            {/* Logo Section */}
            <div className="p-8 pb-12">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <ShieldCheck className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-white font-black tracking-tighter text-xl">RESONATE</h2>
                        <p className="text-emerald-500 font-bold text-[8px] uppercase tracking-[0.3em]">Master Control</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                                    ? "bg-white/10 text-emerald-400 border border-white/10"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                                    {item.icon}
                                </div>
                                <span className="font-bold text-sm tracking-wide">{item.name}</span>
                            </div>
                            {isActive && <ChevronRight size={14} className="text-emerald-400 animate-pulse" />}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Logout Mini-card */}
            <div className="p-6">
                <div className="p-4 bg-white/5 rounded-[1.5rem] border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-black text-slate-400">
                            AD
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-white font-bold text-xs truncate">Superadmin</p>
                            <p className="text-slate-500 text-[10px] font-medium truncate">Production Cluster</p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.location.href = "/"}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors text-[10px] font-black uppercase tracking-widest"
                    >
                        <LogOut size={12} /> Exit System
                    </button>
                </div>
            </div>
        </aside>
    );
}
