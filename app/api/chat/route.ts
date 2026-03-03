import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Get all notes from DB
    const notes = await prisma.knowledge.findMany();

    const context = notes
      .map(
        (n) => `
Title: ${n.title}
Content: ${n.content}
Summary: ${n.summary || ""}
Tags: ${n.tags?.join(", ") || ""}
`
      )
      .join("\n\n");

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: "You are a personal knowledge assistant. Answer using the user's notes only."
            },
            {
              role: "user",
              content: `
User Question:
${message}

User Notes:
${context}
              `,
            },
          ],
          max_tokens: 400,
        }),
      }
    );

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "No response";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}