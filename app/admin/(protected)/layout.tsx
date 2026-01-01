import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('resonate_admin_session')?.value;

    if (!adminSession) {
        redirect('/admin/login');
    }

    return (
        <div className="flex bg-[#fcfcfd] min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-72 min-h-screen relative">
                {/* Global Background Glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/20 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

                <div className="p-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
