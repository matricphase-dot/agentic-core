
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { withRetry } from '@/lib/ai-helper';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const { question } = await request.json();

        if (!question) {
            return NextResponse.json({ error: 'Question is required' }, { status: 400 });
        }

        // 1. Search KB (Simple keyword match for MVP)
        // In a real app, we'd use vector embeddings/search.
        // Here we just pull all published items and filter in code (assuming small KB for MVP)
        // or use simple 'contains' if list is huge (but 'contains' is slow).
        // Let's fetch all published FAQs and Articles (titles/questions).

        const [faqs, articles] = await Promise.all([
            prisma.supportFAQ.findMany({
                where: { isPublished: true },
            }),
            prisma.supportArticle.findMany({
                where: { isPublished: true },
            })
        ]);

        // Simple relevance scoring
        const lowerQ = question.toLowerCase();
        const scoredItems = [
            ...faqs.map(f => ({
                type: 'FAQ',
                id: f.id,
                title: f.question,
                content: f.answerMarkdown,
                score: (f.question.toLowerCase().includes(lowerQ) ? 10 : 0) +
                    (f.answerMarkdown.toLowerCase().includes(lowerQ) ? 5 : 0)
            })),
            ...articles.map(a => ({
                type: 'Article',
                id: a.id,
                title: a.title,
                content: a.contentMarkdown,
                score: (a.title.toLowerCase().includes(lowerQ) ? 10 : 0) +
                    (a.contentMarkdown.toLowerCase().includes(lowerQ) ? 5 : 0)
            }))
        ].filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5); // Take top 5

        const contextText = scoredItems.map(item => `
            [${item.type}] ${item.title}:
            ${item.content}
        `).join('\n\n');

        // 2. Ask Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const systemPrompt = `You are the Resonate Support Assistant.
        Answer the user's question ONLY using the provided Knowledge Base context below.
        
        Rules:
        1. If the answer is found in the context, provide a clear, concise, step-by-step answer.
        2. If the answer is NOT in the context, say exactly: "I'm not sure about that. Please contact our support team for help."
        3. Do not make up facts.
        4. Be polite and professional.
        5. Format your response in Markdown.

        Knowledge Base Context:
        ${contextText || "(No relevant info found in KB)"}
        `;

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: systemPrompt }] },
                { role: "model", parts: [{ text: "Understood. I will answer based strictly on the provided context." }] },
            ]
        });

        const result = await withRetry(async () => {
            return await chat.sendMessage(question);
        });
        const response = await result.response;
        const answer = response.text();

        return NextResponse.json({
            answer,
            sources: scoredItems.map(i => ({ title: i.title, type: i.type })),
            confidence: scoredItems.length > 0 ? 'high' : 'low'
        });

    } catch (error) {
        console.error("AI Support Error:", error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
