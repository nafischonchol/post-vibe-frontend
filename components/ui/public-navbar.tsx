import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/admin/ui/button";

export function PublicNavbar() {
  return (
    <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-base">
          PV
        </span>
        <span className="text-lg font-bold tracking-tight text-white">Post-Vibe</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/login">
          <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
            Tenant Login
          </Button>
        </Link>
        <Link href="/admin/login">
          <Button variant="secondary" className="bg-slate-800 text-slate-200 hover:bg-slate-700">
            <Shield className="mr-1.5 h-4 w-4 text-indigo-400" />
            Admin
          </Button>
        </Link>
      </div>
    </header>
  );
}
