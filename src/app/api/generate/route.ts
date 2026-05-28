import { NextResponse } from 'next/server';

const GEMINI_URL = process.env.GEMINI_API_URL || 'https://gemini.googleapis.com/v1/models/text-bison-001:generate';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function buildGeminiPrompt(description: string, mode: string) {
  return `You are an expert Prompt Engineer specializing in "Vibecoding." Your job is to take a casual description of a website from the user and turn it into a highly detailed, single prompt that they can copy/paste directly into AI code generators like Bolt.new, Lovable, or v0.

Strictly adhere to these Zero-Stress Execution Rules in the output prompt you generate:
1. NO TODOs: Command the target AI never to write placeholders, truncate code, or use "// TODO" comments. It must write complete, functional code.
2. ZERO CONFIG: Tell the target AI to use a single-file structure or highly standard layouts that don't require configuring complex file systems.
3. BUILT-IN MOCK DATA: Hardcode rich, realistic JSON arrays directly inside the code so the app works instantly without database configuration.
4. NATIVE STYLING: Restrict all styling strictly to native Tailwind CSS classes and 'lucide-react' icons to prevent package install errors.
5. EXPLICIT ERROR HANDLING: Instruct the target AI to build UI fallbacks (e.g., standard "No results found" states) so the UI never crashes during interaction.

User App Description: ${description.trim()}
Vibe Mode Selected: ${mode}
`;
}

export async function POST(request: Request) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const description = typeof body?.description === 'string' ? body.description.trim() : '';
  const mode = typeof body?.mode === 'string' ? body.mode.trim() : '';

  if (!description || !mode) {
    return NextResponse.json({ error: 'Missing description or mode in request body.' }, { status: 400 });
  }

  const prompt = buildGeminiPrompt(description, mode);

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GEMINI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: { text: prompt },
      temperature: 0.2,
      maxOutputTokens: 900,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    return NextResponse.json({ error: `Gemini request failed: ${response.statusText}`, details: errorBody }, { status: response.status });
  }

  const data = await response.json();
  const generatedPrompt =
    data?.candidates?.[0]?.output || data?.output?.[0]?.content || data?.output || data?.text || 'No prompt returned from Gemini.';

  return NextResponse.json({ prompt: String(generatedPrompt).trim() });
}
