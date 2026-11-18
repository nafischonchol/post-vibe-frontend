"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, Loader2, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Button } from "@/components/admin/ui/button";
import { Label } from "@/components/admin/ui/label";
import { tenantApi } from "@/services/tenant-api";

export default function TenantRegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    timezone: "Asia/Dhaka",
    owner_name: "",
    owner_email: "",
    owner_password: "",
    confirm_password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.owner_password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    if (form.owner_password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await tenantApi.register({
        name: form.name.trim(),
        email: form.email.trim(),
        timezone: form.timezone,
        owner_name: form.owner_name.trim(),
        owner_email: form.owner_email.trim(),
        owner_password: form.owner_password,
      });

      if (res?.status === "success" || res?.resources?.tenant) {
        setIsSubmitted(true);
      } else {
        setError(res?.message || "Registration failed. Please check your details.");
      }
    } catch (err: any) {
      setError(err?.message || "Registration failed. Email or workspace might already be taken.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-xs">
            PV
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Create your Tenant Workspace
          </h1>
          <p className="text-sm text-slate-500">
            Register your organization to start syndicating video content
          </p>
        </div>

        {isSubmitted ? (
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardContent className="pt-6 pb-6 text-center space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-2">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">Registration Submitted</h2>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your workspace <span className="font-semibold text-slate-800">{form.name}</span> has been created and is now <span className="font-semibold text-amber-600">pending administrator approval</span>.
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs text-left">
                An administrator will review and activate your workspace shortly. Once approved, you can log in using your registered credentials (<span className="font-medium text-slate-900">{form.owner_email}</span>).
              </div>

              <div className="pt-2">
                <Link href="/login" className="w-full">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Proceed to Login
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg">Workspace Registration</CardTitle>
              <CardDescription className="text-xs">
                Fill in your company and owner details. All new registrations require admin approval.
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

                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                    Workspace Information
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700">Workspace Name</Label>
                      <Input
                        type="text"
                        placeholder="e.g. Apex Media Hub"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700">Workspace Email</Label>
                      <Input
                        type="email"
                        placeholder="contact@apexmedia.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700">Timezone</Label>
                    <select
                      value={form.timezone}
                      onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                      className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    >
                      <option value="Asia/Dhaka">Asia/Dhaka (UTC+6)</option>
                      <option value="UTC">UTC (UTC+0)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                      <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                    Initial Owner Account
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700">Full Name</Label>
                      <Input
                        type="text"
                        placeholder="e.g. John Doe"
                        value={form.owner_name}
                        onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700">Owner Login Email</Label>
                      <Input
                        type="email"
                        placeholder="john@apexmedia.com"
                        value={form.owner_email}
                        onChange={(e) => setForm({ ...form, owner_email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700">Password</Label>
                      <Input
                        type="password"
                        placeholder="Min 8 characters"
                        value={form.owner_password}
                        onChange={(e) => setForm({ ...form, owner_password: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700">Confirm Password</Label>
                      <Input
                        type="password"
                        placeholder="Repeat password"
                        value={form.confirm_password}
                        onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-4"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Registration...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Register Workspace
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
            Sign In to Tenant Portal
          </Link>
        </p>
      </div>
    </div>
  );
}
