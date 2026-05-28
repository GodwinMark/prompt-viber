import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VibePrompt AI',
  description: 'Stress-free prompt generation for vibe coders using Gemini.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
