
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmailTemplate } from '@/lib/email';

const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, subject, message, userId } = body;

        if (!email || !subject || !message) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Create Ticket
        const ticket = await prisma.supportTicket.create({
            data: {
                userId, // Nullable
                email,
                subject,
                message,
                status: 'open',
                events: {
                    create: {
                        eventType: 'created',
                        actor: userId ? 'user' : 'system',
                        message: 'Ticket created via support form'
                    }
                }
            }
        });

        // Notify Admin
        if (ADMIN_NOTIFICATION_EMAIL) {
            // Fire and forget (or await if critical) to avoid lagging response
            await sendEmailTemplate({
                to: ADMIN_NOTIFICATION_EMAIL,
                subjectTemplate: '[Support] New Ticket: {{subject}}',
                htmlTemplate: `<p>New ticket from {{email}}</p><p><strong>Subject:</strong> {{subject}}</p><p>{{message}}</p><p><a href="{{app_url}}/admin/support/{{ticketId}}">Manage Ticket</a></p>`,
                variables: {
                    email,
                    subject,
                    message,
                    ticketId: ticket.id,
                    app_url: process.env.APP_BASE_URL || 'http://localhost:3000'
                }
            });
        }

        return NextResponse.json({ success: true, ticketId: ticket.id });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
