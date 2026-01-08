import { requireAdmin } from '@/lib/security/authz';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  await requireAdmin();
    try {
        const searchParams = req.nextUrl.searchParams;
        const status = searchParams.get('status') || undefined;

        const tickets = await prisma.supportTicket.findMany({
            where: {
                status: status
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 50 // temp limit
        });

        return NextResponse.json(tickets);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

