import Link from "next/link";
import { ArrowRight, Video, Zap, Layers, Share2 } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { PublicNavbar } from "@/components/ui/public-navbar";

export default function RootHomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
      {/* Navbar */}
      <PublicNavbar />

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-6 py-20 text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300">
          <Zap className="h-3.5 w-3.5" />
          Automated Video Syndication SaaS v3.1
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Ingest Once. AI Enhance.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Publish Everywhere.
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Multi-tenant platform for automated social media video collection, platform-specific AI metadata generation, and synchronized publishing across YouTube, TikTok, and Facebook Reels.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/login">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
              Open Tenant Portal
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              Platform Admin Portal
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 text-left">
          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-5 space-y-2">
            <Video className="h-5 w-5 text-indigo-400" />
            <h3 className="font-semibold text-sm text-slate-200">Video Ingestion</h3>
            <p className="text-xs text-slate-400">
              Automated source collection, deduplication, caption extraction, and temporary S3 caching.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-5 space-y-2">
            <Layers className="h-5 w-5 text-purple-400" />
            <h3 className="font-semibold text-sm text-slate-200">AI Metadata</h3>
            <p className="text-xs text-slate-400">
              Provider-flexible OpenRouter & Gemini models tailored for YouTube, TikTok, and Facebook formats.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-5 space-y-2">
            <Share2 className="h-5 w-5 text-emerald-400" />
            <h3 className="font-semibold text-sm text-slate-200">Multi-Channel Syndicate</h3>
            <p className="text-xs text-slate-400">
              Atomic publishing batches, transactional quota reservations, and automatic failure reconciliation.
            </p>
          </div>
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
