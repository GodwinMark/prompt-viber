import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - VibePrompt AI',
  description: 'Read the privacy policy for VibePrompt AI and learn how your data is handled.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-glow backdrop-blur-xl">
        <h1 className="text-4xl font-semibold text-white">Privacy Policy</h1>
        <p className="mt-5 text-slate-300 leading-8">
          VibePrompt AI is committed to protecting your privacy. This policy explains what information we collect and how we use it.
        </p>

        <section className="mt-10 space-y-6 text-slate-300 leading-7">
          <div>
            <h2 className="text-2xl font-semibold text-white">Data Collection</h2>
            <p className="mt-3">
              We do not collect personal data directly through the prompt generator. The text you enter is used only to generate the prompt in the session and is not stored permanently.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">Third-party services</h2>
            <p className="mt-3">
              This site may use third-party services like Google AdSense for advertising and analytics. These services may collect anonymous usage data in accordance with their own privacy policies.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">Security</h2>
            <p className="mt-3">
              We use standard security practices to protect the site and API connections. However, no internet transmission is completely secure.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">Contact</h2>
            <p className="mt-3">
              If you have questions about this privacy policy, please reach out through the contact information listed on the site.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
