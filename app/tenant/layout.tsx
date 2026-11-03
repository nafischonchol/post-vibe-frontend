import Link from "next/link";
import {
  LayoutDashboard,
  Radio,
  Video,
  FileCode,
  Share2,
  Send,
  Calendar,
  History,
  BarChart3,
  Gauge,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

export const metadata = {
  title: "Post-Vibe | Tenant Portal",
  description: "Automated Video Syndication Dashboard",
};

const navItems = [
  { label: "Dashboard", href: "/tenant/dashboard", icon: LayoutDashboard },
  { label: "Video Sources", href: "/tenant/sources", icon: Radio },
  { label: "Videos", href: "/tenant/videos", icon: Video },
  { label: "AI Metadata", href: "/tenant/metadata", icon: FileCode },
  { label: "Platform Accounts", href: "/tenant/platform-accounts", icon: Share2 },
  { label: "Publishing", href: "/tenant/publishing", icon: Send },
  { label: "Calendar", href: "/tenant/calendar", icon: Calendar },
  { label: "History", href: "/tenant/history", icon: History },
  { label: "Analytics", href: "/tenant/analytics", icon: BarChart3 },
  { label: "Quota & Usage", href: "/tenant/quota", icon: Gauge },
  { label: "Team", href: "/tenant/team", icon: Users },
  { label: "Settings", href: "/tenant/settings", icon: Settings },
];

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Tenant Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white">
        <div className="flex h-16 shrink-0 items-center border-b border-slate-100 px-6">
          <Link href="/tenant/dashboard" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm">
              PV
            </span>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 leading-tight">
                Post-Vibe
              </span>
              <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">
                Tenant Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Tenant Quota Indicator */}
        <div className="m-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Daily Quota</span>
            <span className="text-indigo-600">0 / 50</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-indigo-100 overflow-hidden">
            <div className="h-full rounded-full bg-indigo-600 w-0" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <Icon className="h-4 w-4 text-slate-500" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-100 p-4">
          <Link
            href="/login"
            className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Body */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="text-sm font-medium text-slate-500">
            Automated Video Syndication
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
              Tenant Workspace
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto w-full p-6">{children}</main>
      </div>
    </div>
  );
}
