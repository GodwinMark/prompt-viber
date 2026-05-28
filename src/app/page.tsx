'use client';

import { Copy, Loader2, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const modes = [
  {
    id: 'pure',
    label: 'Pure Vibe',
    subtitle: '0% Stress - No Deps, Pure UI',
  },
  {
    id: 'builder',
    label: 'Builder Vibe',
    subtitle: 'Low Stress - Minimalist Packages Allowed',
  },
];

const taskTypes = [
  {
    id: 'website',
    label: 'Website',
    subtitle: 'Generate a website prompt',
  },
  {
    id: 'image',
    label: 'Image',
    subtitle: 'Generate an image prompt',
  },
];

export default function HomePage() {
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState('pure');
  const [taskType, setTaskType] = useState('website');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [showSplash, setShowSplash] = useState(true);

  const taskLabel = useMemo(
    () => (taskType === 'website' ? 'website' : 'image'),
    [taskType]
  );

  const promptPlaceholder = useMemo(
    () =>
      taskType === 'website'
        ? 'e.g. A neon portfolio landing page for a crypto-focused creative studio with animated cards and a data dashboard.'
        : 'e.g. A vibrant fantasy landscape with glowing turquoise crystals, dramatic lighting, and a cinematic camera perspective.',
    [taskType]
  );

  const modeLabel = useMemo(
    () => (mode === 'pure' ? '0% Stress Client-Side Only' : 'Low-Stress Modular Structure'),
    [mode]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false);
    }, 1700);
    return () => window.clearTimeout(timer);
  }, []);

  async function handleGenerate() {
    if (!description.trim()) {
      setError('Enter an idea to unlock your prompt.');
      return;
    }

    setError('');
    setResult('');
    setCopied(false);
    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, mode: modeLabel, taskType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to generate prompt');
      }

      setResult(data.prompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <>
      {showSplash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950">
          <style>{`
            @keyframes fadeOut {
              0% { opacity: 1; }
              100% { opacity: 0; }
            }
            .splash-text {
              animation: fadeOut 0.5s ease-in-out forwards;
              animation-delay: 1.2s;
            }
          `}</style>
          <div className="splash-text flex flex-col items-center gap-6 px-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500">
              PromptViber
            </h1>
            <div className="h-1 w-24 sm:w-32 rounded-full bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500"></div>
          </div>
        </div>
      )}
      <main className={`relative min-h-screen bg-slate-950 px-6 py-10 sm:px-10 transition-opacity duration-1000 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
      <div className="pointer-events-none fixed inset-x-0 top-0 h-96 bg-gradient-to-b from-slate-800/80 via-slate-950 to-transparent blur-3xl" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 min-h-full">
        <header className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-glow backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-purple-400/70">VibePrompt AI</p>
              <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Stress-free prompts for vibe coders.</h1>
            </div>
            <div className="rounded-3xl bg-slate-900/90 px-4 py-3 text-sm text-slate-300 ring-1 ring-slate-700">
              <Sparkles className="mr-2 inline-block h-5 w-5 text-cyan-400" />
              Build instantly, no guesswork.
            </div>
          </div>
          <p className="max-w-2xl text-slate-400 sm:text-lg">
            Enter a casual website or image idea and get back a complete, copy-paste Viber prompt built for low-stress, modern creative workflows.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] flex-1">
          <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-glow backdrop-blur-xl">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-purple-400/80">Your idea</p>
              <textarea
                rows={10}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={promptPlaceholder}
                className="w-full resize-none rounded-3xl border border-slate-800 bg-slate-950 px-5 py-5 text-sm text-slate-100 outline-none transition focus:border-purple-400/80 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {taskTypes.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => setTaskType(option.id)}
                  className={`rounded-3xl border px-5 py-4 text-left transition duration-200 ${
                    taskType === option.id
                      ? 'border-cyan-400 bg-slate-900 text-slate-100 shadow-glow'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <p className="font-semibold">{option.label}</p>
                  <p className="mt-1 text-xs text-slate-400">{option.subtitle}</p>
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {modes.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => setMode(option.id)}
                  className={`rounded-3xl border px-5 py-4 text-left transition duration-200 ${
                    mode === option.id
                      ? 'border-purple-400 bg-slate-900 text-slate-100 shadow-glow'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <p className="font-semibold">{option.label}</p>
                  <p className="mt-1 text-xs text-slate-400">{option.subtitle}</p>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">Selected mode: <span className="font-medium text-slate-100">{modeLabel}</span></p>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="inline-flex items-center justify-center gap-3 rounded-3xl bg-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                {loading ? 'Generating...' : 'Generate Prompt'}
              </button>
            </div>

            {error ? <p className="rounded-3xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-glow backdrop-blur-xl flex flex-col h-fit lg:sticky lg:top-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">Output</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Copy-ready Viber {taskLabel} prompt</h2>
              </div>
              <button
                type="button"
                disabled={!result}
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-3xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-100 transition hover:border-slate-700 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Copy className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5 text-sm leading-6 text-slate-300 overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 300px)' }}>
              {loading ? (
                <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-slate-500">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                  <p>Viber is crafting your output. Hold tight.</p>
                </div>
              ) : result ? (
                <pre className="whitespace-pre-wrap break-words text-slate-100">{result}</pre>
              ) : (
                <div className="min-h-[240px] rounded-3xl border border-dashed border-slate-800 bg-slate-900/80 p-6 text-slate-500">
                  <p className="text-slate-400">Your prompt will appear here after generation.</p>
                  <p className="mt-3 text-sm text-slate-500">Copy it into Bolt.new, Lovable, v0, or your favorite AI code generator.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
    </>
  );
}
