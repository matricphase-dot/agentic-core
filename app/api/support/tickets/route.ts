
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/adminAuth';
import { sendEmail } from '@/lib/email';
import { z } from 'zod';

// POST: Create a new ticket (Public/User)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const schema = z.object({
            email: z.string().email(),
            subject: z.string().min(1),
            message: z.string().min(1),
            userId: z.string().optional(),
        });

        const validation = schema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const { email, subject, message, userId } = validation.data;

        // Create Ticket
        const ticket = await prisma.supportTicket.create({
            data: {
                email,
                subject,
                message,
                userId,
                status: 'open',
                priority: 'normal',
                events: {
                    create: {
                        eventType: 'created',
                        actor: userId ? 'user' : 'system',
                        message: 'Ticket created',
                    }
                }
            },
        });

        // Send Email Notification to Admin
        const adminEmail = process.env.SUPPORT_NOTIFICATION_EMAIL || 'resonateteam@zohomail.com';
        await sendEmail({
            to: adminEmail,
            subject: `[Resonate Support] New ticket #${ticket.id.slice(0, 8)}: ${subject}`,
            html: `
                <p>New support ticket from <b>${email}</b></p>
                <p><b>Subject:</b> ${subject}</p>
                <p><b>Message:</b></p>
                <blockquote style="border-left: 2px solid #ccc; padding-left: 10px; color: #555;">
                    ${message.replace(/\n/g, '<br>')}
                </blockquote>
                <p><a href="${process.env.APP_BASE_URL || 'http://localhost:3000'}/admin/support/${ticket.id}">View in Admin</a></p>
            `,
        });

        return NextResponse.json(ticket);
    } catch (error) {
        console.error("Error creating ticket:", error);
        return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
    }
}

// GET: List tickets (Admin only)
export async function GET(request: Request) {
    const admin = await getCurrentAdmin();
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    const where: any = {};
    if (status && status !== 'all') where.status = status;
    if (priority && priority !== 'all') where.priority = priority;

    try {
        const tickets = await prisma.supportTicket.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                subject: true,
                status: true,
                priority: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        return NextResponse.json(tickets);
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
    }
}
