
import { getAdminSession } from "@/lib/security/authz";
import { User, Shield, Clock, Mail, Server } from "lucide-react";

export default async function AdminDetailsPage() {
    const session = await getAdminSession();

    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-red-500 font-bold bg-red-50 p-6 rounded-2xl border border-red-100 shadow-lg">
                    ⚠️ Session Expired or Unauthorized
                </div>
            </div>
        );
    }

    const details = [
        { label: "Admin ID", value: session.id, icon: <Server className="text-emerald-500" /> },
        { label: "Email Address", value: session.email, icon: <Mail className="text-blue-500" /> },
        { label: "Security Role", value: session.role.toUpperCase(), icon: <Shield className="text-purple-500" /> },
        { label: "Session Type", value: "JWT (Stateless)", icon: <User className="text-orange-500" /> },
    ];

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <header className="text-center space-y-4">
                <div className="inline-block px-4 py-1.5 bg-emerald-100/50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-[0.4em] rounded-full">
                    Production Identity Management
                </div>
                <h1 className="text-6xl font-black bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tighter">
                    ADMIN DETAILS
                </h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {details.map((detail, i) => (
                    <div key={i} className="group p-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:border-blue-300 transition-all duration-500">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-500">
                                {detail.icon}
                            </div>
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{detail.label}</span>
                        </div>
                        <div className="text-2xl font-black text-gray-800 break-all leading-tight">
                            {detail.value}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-8 bg-gray-900 rounded-[2.5rem] border border-gray-800 shadow-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2">
                        <h3 className="text-white font-black text-xl uppercase tracking-widest">Environment Audit</h3>
                        <p className="text-gray-500 font-medium text-sm">Real-time infrastructure verification</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">TLS 1.3 Secure</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">Node.js Production</span>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="text-center text-gray-400 font-black text-[9px] uppercase tracking-[0.8em] pb-12">
                Resonate Security Cluster Identity Utility
            </footer>
        </div>
    );
}
