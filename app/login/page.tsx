import Link from "next/link";
import { LogIn } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Button } from "@/components/admin/ui/button";

export default function TenantLoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-sm">
            PV
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Sign in to your Tenant Portal
          </h1>
          <p className="text-sm text-slate-500">
            Manage video syndication across YouTube, TikTok, and Facebook Reels
          </p>
        </div>

        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg">Tenant Sign In</CardTitle>
            <CardDescription>
              Enter your email and password to access your workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Email or Username</label>
              <Input type="text" placeholder="name@company.com" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Password</label>
              </div>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-400">
          Admin portal?{" "}
          <Link href="/admin/login" className="font-semibold text-indigo-600 hover:underline">
            Go to Admin Login
          </Link>
        </p>
      </div>
    </div>
  );
}
