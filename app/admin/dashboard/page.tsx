import { Rocket, Mail, LifeBuoy, Shield, Activity, Globe, Cpu } from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Hero Section */}
            <header className="relative p-12 bg-slate-900 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/5 to-transparent opacity-50"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] rounded-full">
                            System Authorization: L5-SUPERADMIN
                        </div>
                        <h1 className="text-6xl font-black text-white tracking-tighter">
                            OPERATIONS CENTER
                        </h1>
                        <p className="text-slate-400 text-lg font-medium max-w-xl">
                            Welcome to the primary control interface for the Resonate High-Availability Cluster.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl text-center min-w-[140px]">
                            <p className="text-emerald-400 font-black text-2xl">99.9%</p>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Uptime</p>
                        </div>
                        <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl text-center min-w-[140px]">
                            <p className="text-blue-400 font-black text-2xl">2.4ms</p>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Latency</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Quick Access Modules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { name: "Marketing", href: "/admin/marketing", icon: <Rocket size={24} />, color: "emerald", desc: "AI Content Generation" },
                    { name: "Outreach", href: "/admin/outreach", icon: <Mail size={24} />, color: "blue", desc: "Automated Engagement" },
                    { name: "Support", href: "/admin/support", icon: <LifeBuoy size={24} />, color: "purple", desc: "Infrastructure Health" },
                ].map((mod) => (
                    <a
                        key={mod.name}
                        href={mod.href}
                        className="group p-8 bg-white/60 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-2"
                    >
                        <div className={`w-16 h-16 rounded-2xl bg-${mod.color}-500 flex items-center justify-center mb-6 text-white shadow-lg shadow-${mod.color}-500/20 group-hover:scale-110 transition-transform`}>
                            {mod.icon}
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">{mod.name}</h3>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed">{mod.desc}</p>
                    </a>
                ))}
            </div>

            {/* Infrastructure Monitor */}
            <div className="p-10 bg-white/40 backdrop-blur-2xl border border-white/20 rounded-[3rem] shadow-xl">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                        <Activity className="text-emerald-500" /> Infrastructure Pulse
                    </h3>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full animate-pulse">
                        LIVE MONITORING ACTIVE
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: "Global Traffic", value: "Verified", icon: <Globe size={18} /> },
                        { label: "AI Cluster", value: "Stable", icon: <Cpu size={18} /> },
                        { label: "Prisma Layer", value: "Connected", icon: <Activity size={18} /> },
                        { label: "Auth Mesh", value: "Locked", icon: <Shield size={18} /> },
                    ].map((stat, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex items-center gap-2 text-slate-400">
                                {stat.icon}
                                <span className="text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
                            </div>
                            <p className="text-xl font-black text-slate-800">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="text-center text-slate-300 font-black text-[9px] uppercase tracking-[0.8em] pt-12">
                Resonate Security Cluster Identity Utility
            </footer>
        </div>
    );
}
