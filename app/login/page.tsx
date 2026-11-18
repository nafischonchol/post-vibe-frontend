"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Button } from "@/components/admin/ui/button";
import { tenantApi } from "@/services/tenant-api";

export default function TenantLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@postvibe.com");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await tenantApi.login({ email, password });
      if (res?.resources?.token) {
        localStorage.setItem("tenant_token", res.resources.token);
        if (res.resources.tenant) {
          localStorage.setItem("tenant_workspace", JSON.stringify(res.resources.tenant));
        }
        if (res.resources.user) {
          localStorage.setItem("tenant_user", JSON.stringify(res.resources.user));
        }
        document.cookie = `tenant_token=${res.resources.token}; path=/; max-age=259200; SameSite=Lax`;
        router.push("/tenant/dashboard");
      } else {
        setError(res?.message || "Failed to authenticate workspace.");
      }
    } catch (err: any) {
      setError(err?.message || "Invalid credentials or network error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-xs">
            PV
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Sign in to your Tenant Portal
          </h1>
          <p className="text-sm text-slate-500">
            Manage video syndication across YouTube, TikTok, and Facebook Reels
          </p>
        </div>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg">Tenant Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@postvibe.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-2 text-center text-xs text-slate-500">
          <p>
            Don&apos;t have a workspace?{" "}
            <Link href="/register" className="font-semibold text-indigo-600 hover:underline">
              Register here
            </Link>
          </p>
          <p className="text-slate-400">
            Admin portal?{" "}
            <Link href="/admin/login" className="font-semibold text-slate-600 hover:underline">
              Go to Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
