import { requireAdmin } from '@/lib/security/authz';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { getCurrentAdmin } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  await requireAdmin();
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { ticketId, message } = await req.json();

        if (!ticketId || !message) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
        if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

        // Send Email to User
        const emailResult = await sendEmail({
            to: ticket.email,
            subject: `Re: ${ticket.subject}`,
            html: `<p>${message.replace(/\n/g, '<br>')}</p><hr><p>Original Message:</p><blockquote>${ticket.message}</blockquote>`
        });

        if (!emailResult.success) {
            throw new Error(emailResult.error);
        }

        // Update Ticket State
        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: {
                status: 'resolved', // Auto-resolve on reply? Optional, maybe keep as is or set to 'pending user'
                updatedAt: new Date(),
                events: {
                    create: {
                        eventType: 'admin_replied',
                        actor: `admin:${admin.email}`,
                        message: message
                    }
                }
            }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

