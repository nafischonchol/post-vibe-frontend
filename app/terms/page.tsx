import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, ShieldCheck, Scale, Ban } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Post-Vibe",
  description: "Terms of Service and Usage Agreement for Post-Vibe and Sports Seekers syndication.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white font-bold text-xs">
            PV
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">Post-Vibe</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        <div className="space-y-3 border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
            <Scale className="h-3.5 w-3.5" />
            Legal Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-400">
            Last updated: November 2026 • Effective for Post-Vibe and Sports Seekers syndication platform
          </p>
        </div>

        <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-indigo-400" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, registering with, or utilizing the Post-Vibe platform (including associated modules such as the Sports Seekers video syndication engine), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree to these terms, you are prohibited from using or accessing this service.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-400" />
              2. Service Description & API Integration
            </h2>
            <p>
              Post-Vibe provides multi-tenant short-form video workflow automation, AI-driven metadata generation, and publishing syndication across third-party social media platforms, including TikTok, YouTube Shorts, and Facebook Reels.
            </p>
            <p>
              By authorizing destination accounts, you grant Post-Vibe permission to interact with third-party APIs (such as the <strong>TikTok Content Posting API</strong>) on your behalf solely to publish scheduled media and retrieve publication status.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Ban className="h-4 w-4 text-indigo-400" />
              3. User Responsibilities & Content Standards
            </h2>
            <p>When uploading, ingesting, or distributing media through Post-Vibe, you represent and warrant that:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>You own or hold valid licenses, permissions, and rights to syndicate the uploaded media content.</li>
              <li>
                Your content complies with the community guidelines and policies of each destination platform, including the <strong>TikTok Community Guidelines</strong>, YouTube Terms of Service, and Meta Community Standards.
              </li>
              <li>You will not use the service to distribute spam, copyright-infringing works, abusive, violent, or unlawful material.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-indigo-400" />
              4. Platform Availability & Third-Party Dependencies
            </h2>
            <p>
              Post-Vibe relies on external APIs provided by TikTok, Google, and Meta. We are not liable for publication failures, delayed syndications, or account restrictions resulting from third-party API downtimes, policy updates, rate-limiting quotas, or platform service suspensions.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-400" />
              5. Account Termination & Disconnection
            </h2>
            <p>
              You may terminate your connection to any destination platform at any time via the Tenant Dashboard. We reserve the right to suspend or terminate tenant access immediately if you violate these terms or abuse API rate quotas.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Scale className="h-4 w-4 text-indigo-400" />
              6. Contact Information
            </h2>
            <p>
              For any questions or legal inquiries regarding these Terms of Service, please reach out to:
            </p>
            <div className="rounded-lg border border-slate-800 bg-slate-800/50 p-4 text-xs text-slate-300 space-y-1">
              <p><strong className="text-white">Post-Vibe / Sports Seekers Team</strong></p>
              <p>Email: legal@postvibe.local / support@postvibe.local</p>
              <p>Platform: Post-Vibe Automated Video Syndication Platform</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>Post-Vibe Automated Video Syndication SaaS &copy; 2026. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="hover:text-slate-300 transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
