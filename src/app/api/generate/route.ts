import { NextResponse } from 'next/server';

const GEMINI_URL = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function buildGeminiPrompt(description: string, mode: string, taskType: string) {
  const typeInstructions =
    taskType === 'image'
      ? `You are an expert Prompt Engineer specializing in creating premium, high-quality image-generation prompts for AI art systems. Your job is to transform a casual user description into an exhaustively detailed, single prompt that can be copy-pasted directly into image-generation tools like Stable Diffusion, Midjourney, or any creative AI that accepts text prompts.

**YOUR CRITICAL INSTRUCTIONS FOR IMAGE PROMPTS:**
1. BE EXTREMELY VERBOSE AND DETAILED: Describe every element of the scene, including composition, lighting, atmosphere, color palette, textures, camera angle, lens effect, focal point, and overall mood.
2. SPECIFY EVERY VISUAL DETAIL: Mention exact materials, surface treatments, reflections, depth of field, background style, environment, and any special effects like glow, fog, or cinematic lighting.
3. STYLE AND MEDIUM: Define the art style clearly — photorealistic, digital painting, neon synthwave, vector illustration, modern editorial, film still, etc. Include references to visual artists or photography terms when appropriate.
4. LAYOUT AND FOCUS: Describe the image layout (foreground, midground, background), subject positioning, perspective, and visual hierarchy.
5. FINISH AND QUALITY: Insist on ultra-high resolution, crisp details, rich textures, and professional-grade visual fidelity.
6. DO NOT STOP EARLY: Keep generating until the full image prompt is complete and there is no ambiguity in the final description.
7. FORCE CONTINUATION: If the response is long, include a clear continuation phrase at the end so the target AI keeps writing until the full prompt is delivered.`
      : `You are an expert Prompt Engineer specializing in creating incredibly DETAILED, ELABORATE, and COMPREHENSIVE prompts for AI code generators. Your job is to transform a casual user description into an exhaustively detailed, single prompt that can be copy-pasted directly into Bolt.new, Lovable, or v0.

**YOUR CRITICAL INSTRUCTIONS FOR WEBSITE PROMPTS:**
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
   - Do not stop generation early; keep producing content until the prompt is fully complete
5. INCLUDE EXACT SPECIFICATIONS:
   - Color hex codes or Tailwind class names for every element
   - Font weights and sizes for headings and body text
   - Exact pixel measurements for padding/margins where relevant
   - Animation timings and easing functions if animations are needed
   - Responsive breakpoints and how layout changes at each breakpoint
   - Form field validations with error messages
   - User interaction feedback (hover, click, focus states)
6. ELABORATE ON USER FLOWS: Describe step-by-step what happens when users interact with the app, including edge cases and error scenarios.
7. FORCE COMPLETION: If the response is longer than one pass, include a clear continuation instruction at the end so the target AI keeps going until the full prompt is delivered.
8. MINIMUM LENGTH: For a moderately complex website, the prompt should be at least 100 lines long. If needed, continue writing until the full prompt is complete and the final sentence is finished.`;

return `${typeInstructions}

**MODE CONTEXT:**
${mode === '0% Stress Client-Side Only' ? 'Pure Vibe Mode: Absolutely ZERO external dependencies beyond React and Tailwind. Everything must work without installing extra packages. Maximum simplicity, maximum functionality.' : 'Builder Vibe Mode: Minimal packages allowed (only essentials like Tailwind, lucide-react). Keep dependencies to an absolute minimum but you can add 1-2 lightweight utility libraries if needed.'}

**TASK TYPE:**
${taskType === 'image' ? 'High-quality image prompt' : 'Website prompt'}

**USER DESCRIPTION:**
"${description.trim()}"

**NOW GENERATE AN EXHAUSTIVELY DETAILED PROMPT:**
Create a comprehensive prompt that instructs another AI to build this ${taskType === 'image' ? 'high-quality image' : 'website'}. Be ridiculously detailed. Include every visual element, interaction, color, spacing, animation, and functionality requirement. Make the prompt so clear and detailed that following it results in a polished, production-ready result with zero ambiguity.`;
}

export async function POST(request: Request) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const description = typeof body?.description === 'string' ? body.description.trim() : '';
  const mode = typeof body?.mode === 'string' ? body.mode.trim() : '';
  const taskType = typeof body?.taskType === 'string' && ['website', 'image'].includes(body.taskType)
    ? body.taskType
    : 'website';

  if (!description || !mode) {
    return NextResponse.json({ error: 'Missing description or mode in request body.' }, { status: 400 });
  }

  const prompt = buildGeminiPrompt(description, mode, taskType);

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
        temperature: 0.0,
        topP: 1.0,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    return NextResponse.json({ error: `PromptViber request failed: ${response.statusText}`, details: errorBody }, { status: response.status });
  }

  const data = await response.json();
  const generatedPrompt =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.text || 'No prompt returned from Gemini.';

  return NextResponse.json({ prompt: String(generatedPrompt).trim() });
}
