import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// CREATE NOTE
export async function POST(req: Request) {
  try {
    const body = await req.json();

    let summary: string | null = null;
    let generatedTags: string[] = body.tags || [];

    try {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
  },
  body: JSON.stringify({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: `
Give:
1. A 2-3 line summary.
2. 5 short tags separated by commas.
No explanations.

Content:
${body.content}
        `
      }
    ],
    max_tokens: 200
  })
});

const data = await response.json();
const text = data.choices?.[0]?.message?.content || "";

const lines = text.split("\n").filter(Boolean);

if (lines.length > 0) {
  summary = lines[0] + " " + (lines[1] || "");
}

if (lines.length > 2) {
  generatedTags = lines[lines.length - 1]
    .split(",")
    .map((t: string) => t.trim());
}


  console.log("Gemini success:", summary);

} catch (err) {
  console.log("Gemini failed:", err);
}

    const note = await prisma.knowledge.create({
      data: {
        title: body.title,
        content: body.content,
        type: body.type || "note",
        sourceUrl: body.sourceUrl || null,
        summary,
        tags: generatedTags,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json(
      { error: "Failed to save note" },
      { status: 500 }
    );
  }
}

// GET ALL NOTES
export async function GET() {
  try {
    const notes = await prisma.knowledge.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

// DELETE NOTE
export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    await prisma.knowledge.delete({
      where: { id: body.id },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}