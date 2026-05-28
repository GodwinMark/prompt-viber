import { NextResponse } from 'next/server';

const GEMINI_URL = process.env.GEMINI_API_URL || 'https://gemini.googleapis.com/v1/models/text-bison-001:generate';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function buildGeminiPrompt(description: string, mode: string) {
  return `You are an expert Prompt Engineer specializing in creating incredibly DETAILED, ELABORATE, and COMPREHENSIVE prompts for AI code generators. Your job is to transform a casual user description into an exhaustively detailed, single prompt that can be copy-pasted directly into Bolt.new, Lovable, or v0.

**YOUR CRITICAL INSTRUCTIONS:**
1. BE EXTREMELY VERBOSE AND DETAILED: Include every single visual detail, interaction pattern, color scheme, layout element, animation, and functionality requirement - no exceptions.
2. SPECIFY EVERY TINY DETAIL: Mention spacing, padding, font sizes, shadows, borders, hover states, animations, transitions, responsiveness breakpoints, button states, form validations - everything.
3. ARCHITECTURE REQUIREMENTS:
   - Single-file structure or simple modular layout (NO complex configurations)
   - All styling MUST be Tailwind CSS only
   - All icons MUST be lucide-react only
   - Hardcode realistic, rich JSON mock data directly in the code
   - No external APIs, no databases, no backends
4. CODE QUALITY RULES:
   - NO placeholder comments like "// TODO"
   - NO truncated or incomplete code
   - Write complete, production-ready, fully functional code
   - Include error states, loading states, empty states, and fallbacks
5. INCLUDE EXACT SPECIFICATIONS:
   - Color hex codes or Tailwind class names for every element
   - Font weights and sizes for headings and body text
   - Exact pixel measurements for padding/margins where relevant
   - Animation timings and easing functions if animations are needed
   - Responsive breakpoints and how layout changes at each breakpoint
   - Form field validations with error messages
   - User interaction feedback (hover, click, focus states)
6. ELABORATE ON USER FLOWS: Describe step-by-step what happens when users interact with the app, including edge cases and error scenarios.

**MODE CONTEXT:**
${mode === '0% Stress Client-Side Only' ? 'Pure Vibe Mode: Absolutely ZERO external dependencies beyond React and Tailwind. Everything must work without installing extra packages. Maximum simplicity, maximum functionality.' : 'Builder Vibe Mode: Minimal packages allowed (only essentials like Tailwind, lucide-react). Keep dependencies to an absolute minimum but you can add 1-2 lightweight utility libraries if needed.'}

**USER'S WEBSITE DESCRIPTION:**
"${description.trim()}"

**NOW GENERATE AN EXHAUSTIVELY DETAILED PROMPT:**
Create a comprehensive, step-by-step prompt that instructs another AI to build this website. Be ridiculously detailed. Include every visual element, interaction, color, spacing, animation, and functionality requirement. Make the prompt so clear and detailed that following it results in a polished, production-ready app with zero ambiguity.`;
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

  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2500,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    return NextResponse.json({ error: `Gemini request failed: ${response.statusText}`, details: errorBody }, { status: response.status });
  }

  const data = await response.json();
  const generatedPrompt =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.text || 'No prompt returned from Gemini.';

  return NextResponse.json({ prompt: String(generatedPrompt).trim() });
}
