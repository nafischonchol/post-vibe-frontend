"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Layers,
  Cpu,
  Share2,
  Sliders,
  Activity,
  Users,
  ScrollText,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";

type MenuItem = {
  title: string;
  icon: React.ElementType;
  href?: string;
  subItems?: { title: string; href: string }[];
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const menuConfig: MenuSection[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    ],
  },
  {
    title: "SaaS Management",
    items: [
      { title: "Tenants", icon: Building2, href: "/admin/tenants" },
      { title: "Subscriptions", icon: CreditCard, href: "/admin/subscriptions" },
      { title: "Plans", icon: Layers, href: "/admin/plans" },
    ],
  },
  {
    title: "Configuration",
    items: [
      { title: "AI Config", icon: Cpu, href: "/admin/ai-config" },
      { title: "Platform APIs", icon: Share2, href: "/admin/platform-config" },
      { title: "Global Settings", icon: Sliders, href: "/admin/global-settings" },
    ],
  },
  {
    title: "System & Governance",
    items: [
      { title: "System Monitoring", icon: Activity, href: "/admin/monitoring" },
      { title: "Admin Users", icon: Users, href: "/admin/users" },
      { title: "Audit Logs", icon: ScrollText, href: "/admin/audit-logs" },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isLinkActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header / Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm">
              PV
            </span>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 leading-tight">
                Post-Vibe
              </span>
              <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">
                Admin Portal
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {menuConfig.map((section) => (
            <div key={section.title} className="space-y-1">
              <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </h3>
              <div className="space-y-0.5 pt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const hasSubmenu = item.subItems && item.subItems.length > 0;
                  const isSubmenuOpen = openSubmenus[item.title];
                  const active = item.href ? isLinkActive(item.href) : false;

                  if (hasSubmenu) {
                    return (
                      <div key={item.title}>
                        <button
                          onClick={() => toggleSubmenu(item.title)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            isSubmenuOpen
                              ? "bg-slate-50 text-slate-900"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-slate-500" />
                            <span>{item.title}</span>
                          </div>
                          {isSubmenuOpen ? (
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                        {isSubmenuOpen && (
                          <div className="mt-1 space-y-0.5 pl-9 pr-2">
                            {item.subItems!.map((subItem) => {
                              const subActive = isLinkActive(subItem.href);
                              return (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  onClick={() => onClose()}
                                  className={`block rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                                    subActive
                                      ? "bg-indigo-50 font-semibold text-indigo-700"
                                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                  }`}
                                >
                                  {subItem.title}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href!}
                      onClick={() => onClose()}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-indigo-50 font-semibold text-indigo-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          active ? "text-indigo-600" : "text-slate-500"
                        }`}
                      />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
