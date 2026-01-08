import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/security/authz';
import AdminLayout from '@/components/admin/AdminLayout';
import { ToastProvider } from '@/components/admin/FeedbackUI';

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    /* Temporarily bypassing authentication for testing
    try {
        await requireAdmin();
    } catch (e) {
        redirect('/admin/login');
    }
    */

    return (
        <ToastProvider>
            <AdminLayout>
                {children}
            </AdminLayout>
        </ToastProvider>
    );
}
