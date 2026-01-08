import { requireAdmin } from '@/lib/security/authz';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/adminAuth';
import { z } from 'zod';

export async function GET() {
  await requireAdmin();
    if (!await getCurrentAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const faqs = await prisma.supportFAQ.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(faqs);
}

export async function POST(request: Request) {
  await requireAdmin();
    if (!await getCurrentAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const schema = z.object({
        question: z.string().min(1),
        answerMarkdown: z.string().min(1),
        category: z.string().optional(),
        isPublished: z.boolean().optional(),
    });

    const validation = schema.safeParse(body);
    if (!validation.success) return NextResponse.json({ error: validation.error }, { status: 400 });

    const item = await prisma.supportFAQ.create({ data: validation.data });
    return NextResponse.json(item);
}

export async function PUT(request: Request) {
  await requireAdmin();
    if (!await getCurrentAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const item = await prisma.supportFAQ.update({
        where: { id },
        data
    });
    return NextResponse.json(item);
}

export async function DELETE(request: Request) {
  await requireAdmin();
    if (!await getCurrentAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.supportFAQ.delete({ where: { id } });
    return NextResponse.json({ success: true });
}

