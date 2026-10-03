
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { topic, level, confusing } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Missing topic" }, { status: 400 });
    }

    const systemPrompt = `You are Study Buddy - a patient, encouraging top student tutor.
Personality: patient, encouraging, like a top student who explains simply. Clear, supportive, uses analogies.
Knowledge: Feynman technique, active recall, study methods.
Rules:
- Keep EACH layer under 200 words.
- Output JSON only, no markdown.
- Structure:
{
  "analogyTitle": "short catchy analogy title",
  "analogy": "Simple Analogy like I'm 12 - vivid, relatable story, encouraging tone, start with 'Imagine...'",
  "coreTitle": "How [topic] actually works",
  "corePoints": ["bullet 1: mechanism", "bullet 2", "bullet 3", "bullet 4"],
  "quiz": [{"q": "question 1", "a": "answer 1"}, {"q":"q2","a":"a2"}, {"q":"q3","a":"a3"}],
  "encouragement": "one short encouraging line like You've got this!"
}`;

    const userPrompt = `Topic: ${topic}
User level: ${level}
What is specifically confusing: ${confusing || "general understanding"}

Explain in 3 layers for level ${level}. Tailor language complexity to level.
Layer1 = Simple Analogy (like I'm 12 but respect ${level})
Layer2 = Core Explanation with key points
Layer3 = 3 active recall questions that target the confusing part: "${confusing}"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    const parsed = JSON.parse(content || "{}");

    return NextResponse.json(parsed);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message || "AI error" }, { status: 500 });
  }
}
