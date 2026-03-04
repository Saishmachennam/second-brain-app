import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const notes = await prisma.knowledge.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const context = notes.map(n => `${n.title}: ${n.content}`).join("\n");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `Answer this question using the notes below.

Question:
${query}

Notes:
${context}`
        }
      ],
      max_tokens: 300,
    }),
  });

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content || "No answer generated.";

  return NextResponse.json({
    answer,
    sources: notes.map(n => ({
      id: n.id,
      title: n.title,
      createdAt: n.createdAt,
    })),
  });
}