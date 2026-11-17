"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function TenantShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close mobile menu whenever pathname changes without triggering an extra cascading effect
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/tenant/dashboard") return pathname === "/tenant/dashboard" || pathname === "/tenant";
    return pathname.startsWith(href);
  };

  const renderNavLinks = () => (
    <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs sm:text-sm font-medium transition-colors min-h-[42px] ${
              active
                ? "bg-indigo-50 text-indigo-700 font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Icon
              className={`h-4 w-4 shrink-0 ${
                active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
              }`}
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-5">
          <Link href="/tenant/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-xs">
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(false)}
            className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Quota Tracker */}
        <div className="m-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Daily Quota</span>
            <span className="text-indigo-600">Active Plan</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-indigo-100 overflow-hidden">
            <div className="h-full rounded-full bg-indigo-600 w-1/4" />
          </div>
        </div>

        {renderNavLinks()}

        <div className="border-t border-slate-100 p-4">
          <Link
            href="/login"
            className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors py-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="flex h-16 shrink-0 items-center border-b border-slate-100 px-6">
          <Link href="/tenant/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-xs">
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

        {/* Quota Widget */}
        <div className="m-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Daily Quota</span>
            <span className="text-indigo-600 font-mono">0 / 50</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-indigo-100 overflow-hidden">
            <div className="h-full rounded-full bg-indigo-600 w-0" />
          </div>
        </div>

        {renderNavLinks()}

        <div className="border-t border-slate-100 p-4">
          <Link
            href="/login"
            className="flex items-center gap-2.5 text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main App Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Responsive Header / Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Hamburger Button on Mobile / Tablet */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen(true)}
              className="h-9 w-9 p-0 md:hidden border-slate-200 text-slate-700 hover:bg-slate-100 shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-xs font-medium text-slate-500">
                Automated Video Syndication
              </span>
              <span className="sm:hidden font-bold text-slate-900 text-sm">
                Post-Vibe
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/tenant/publishing">
              <Button size="sm" className="hidden sm:inline-flex bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8">
                <Send className="h-3.5 w-3.5 mr-1.5" />
                New Batch
              </Button>
            </Link>
            <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              Workspace
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
