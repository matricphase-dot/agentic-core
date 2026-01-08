
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/adminAuth';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    if (!await getCurrentAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Await params as per Next.js 15+ convention (though this is 14/15 compatible style usually, 
    // seeing 'Promise' type in context suggests newer Next.js or just safe typing)
    const { id } = await context.params;

    const ticket = await prisma.supportTicket.findUnique({
        where: { id },
        include: {
            events: {
                orderBy: { createdAt: 'asc' }
            }
        }
    });

    if (!ticket) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(ticket);
}

// Update Status/Priority
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await context.params;
    const { status, priority } = await request.json();

    const data: any = {};
    if (status) data.status = status;
    if (priority) data.priority = priority;

    const ticket = await prisma.supportTicket.update({
        where: { id },
        data: {
            ...data,
            events: {
                create: {
                    eventType: 'status_changed',
                    actor: `admin:${admin.email}`,
                    message: `Status: ${status}, Priority: ${priority}`
                }
            }
        }
    });

    return NextResponse.json(ticket);
}
