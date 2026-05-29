import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - VibePrompt AI',
  description: 'Learn about VibePrompt AI and how it helps you generate prompts for websites and images.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-glow backdrop-blur-xl">
        <h1 className="text-4xl font-semibold text-white">About VibePrompt AI</h1>
        <p className="mt-5 text-slate-300 leading-8">
          VibePrompt AI helps creators and developers turn casual website and image ideas into polished prompts.
          It is built for fast, low-stress workflows and makes it easy to generate ready-to-use prompt copy.
        </p>

        <section className="mt-10 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">What it does</h2>
            <p className="mt-3 text-slate-300 leading-8">
              Enter your idea, choose whether you need a website or image prompt, and VibePrompt AI will generate a detailed, creative prompt that you can copy and use instantly.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">Why it helps</h2>
            <p className="mt-3 text-slate-300 leading-8">
              This tool saves time when you need high-quality prompt text for design systems, AI art engines, product landing pages, or creative briefs.
              It is designed to keep the process simple and accessible.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">Built with</h2>
            <p className="mt-3 text-slate-300 leading-8">
              VibePrompt AI is built with Next.js, Tailwind CSS, and a server-side AI prompt generation API.
              It is optimized for quick prompt creation and modern UI clarity.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
