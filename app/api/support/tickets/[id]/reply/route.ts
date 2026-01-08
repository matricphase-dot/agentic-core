
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/adminAuth';
import { sendEmail } from '@/lib/email';
import { z } from 'zod';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await context.params;
    const body = await request.json();

    const schema = z.object({
        message: z.string().min(1),
    });

    const validation = schema.safeParse(body);
    if (!validation.success) return NextResponse.json({ error: validation.error }, { status: 400 });

    const { message } = validation.data;

    const ticket = await prisma.supportTicket.findUnique({ where: { id } });
    if (!ticket) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // 1. Send Email
    const emailResult = await sendEmail({
        to: ticket.email,
        subject: `Re: ${ticket.subject} (Ticket #${ticket.id.slice(0, 8)})`,
        html: `
            <p>${message.replace(/\n/g, '<br>')}</p>
            <br>
            <hr>
            <small>You can reply to this email to continue the conversation.</small>
        `,
    });

    if (!emailResult.success) {
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    // 2. Update Ticket (log event + set status to 'in_progress' or 'resolved' if generic?)
    // Let's just log the event. Admin can manually close it.
    await prisma.supportTicket.update({
        where: { id },
        data: {
            status: 'in_progress', // Auto-move to in_progress on reply
            events: {
                create: {
                    eventType: 'admin_replied',
                    actor: `admin:${admin.email}`,
                    message: message // Store the reply content
                }
            }
        }
    });

    return NextResponse.json({ success: true });
}
