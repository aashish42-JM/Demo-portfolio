import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/lib/groq";
import { AI_SYSTEM_PROMPT } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { message: "GROQ_API_KEY not configured. Please add it to .env.local to enable the AI assistant." },
        { status: 200 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: AI_SYSTEM_PROMPT },
        ...messages.slice(-10), // Keep last 10 messages for context
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const message = completion.choices[0]?.message?.content ?? "I couldn't generate a response. Please try again.";

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Groq API error:", error);
    return NextResponse.json(
      { message: "Something went wrong with the AI core. Please try again later." },
      { status: 500 }
    );
  }
}
