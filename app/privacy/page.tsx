import { Shield, Lock, Eye, FileText, RefreshCw, Trash2 } from "lucide-react";
import Link from "next/link";
import { PublicNavbar } from "@/components/ui/public-navbar";

export const metadata = {
  title: "Privacy Policy | Post-Vibe",
  description: "Privacy Policy and Data Protection Practices for Post-Vibe and Sports Seekers syndication.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between">
      {/* Standard Shared Navbar */}
      <PublicNavbar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        <div className="space-y-3 border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
            <Shield className="h-3.5 w-3.5" />
            Official Policy
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400">
            Last updated: November 2026 • Applies to Post-Vibe and Sports Seekers syndication platform
          </p>
        </div>

        <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Eye className="h-4 w-4 text-indigo-400" />
              1. Overview & Scope
            </h2>
            <p>
              Post-Vibe (operating associated modules including Sports Seekers syndication) provides automated short-form video collection, metadata enhancement, and social media syndication services. We respect your privacy and are committed to protecting the personal data and credentials you share when connecting destination social accounts (TikTok, YouTube, Facebook).
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Lock className="h-4 w-4 text-indigo-400" />
              2. Information We Collect & How We Use It
            </h2>
            <p>When you use Post-Vibe to link destination social accounts, we collect and process:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>
                <strong className="text-white">Account Identification:</strong> Display name, profile avatar URL, public username/handle, and unique platform identifiers (e.g., TikTok OpenID, YouTube Channel ID).
              </li>
              <li>
                <strong className="text-white">OAuth Tokens:</strong> Authorization tokens and refresh tokens necessary to authenticate video publishing requests on your behalf.
              </li>
              <li>
                <strong className="text-white">Publishing Content:</strong> Video binaries, video captions, hashtags, and scheduling metadata created or ingested for distribution.
              </li>
              <li>
                <strong className="text-white">Publication Analytics:</strong> Basic publication status, post URLs, and delivery reconciliation logs to confirm whether posts successfully published.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-indigo-400" />
              3. TikTok and Third-Party API Data Usage
            </h2>
            <p>
              Our application connects directly to official third-party APIs including the <strong>TikTok Content Posting API (v2)</strong> and TikTok Login Kit:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>
                We request scopes (<code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">user.info.basic</code>, <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">video.upload</code>, <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">video.publish</code>) strictly to verify your creator identity and upload short-form reels to your designated TikTok account.
              </li>
              <li>
                We <strong>do not sell, rent, or trade</strong> your personal data or social media credentials to third parties or advertising networks.
              </li>
              <li>
                All OAuth tokens are strictly stored encrypted at rest using AES-256-CBC encryption algorithms within secure database storage.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-indigo-400" />
              4. Data Retention, Disconnection & Deletion
            </h2>
            <p>
              You maintain total control over your connected accounts:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>
                <strong className="text-white">Instant Disconnect:</strong> You can disconnect your TikTok or other platform accounts at any moment from the <em>Destination Platform Accounts</em> dashboard. Disconnecting immediately deletes the stored access and refresh tokens from our active database.
              </li>
              <li>
                <strong className="text-white">Third-Party Revocation:</strong> You can also revoke Post-Vibe&apos;s access directly from your TikTok account settings (Security &gt; Manage app permissions).
              </li>
              <li>
                <strong className="text-white">Data Deletion Requests:</strong> To request complete deletion of all associated account logs and metadata, contact our support team at <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">support@postvibe.local</code>.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-400" />
              5. Contact Us
            </h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy or data security practices, please contact:
            </p>
            <div className="rounded-lg border border-slate-800 bg-slate-800/50 p-4 text-xs text-slate-300 space-y-1">
              <p><strong className="text-white">Post-Vibe / Sports Seekers Team</strong></p>
              <p>Email: privacy@postvibe.local / support@postvibe.local</p>
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
