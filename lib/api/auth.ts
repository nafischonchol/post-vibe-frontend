"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
  if (envUrl.endsWith("/api/v1")) return envUrl;
  if (envUrl.endsWith("/api")) return `${envUrl}/v1`;
  return `${envUrl.replace(/\/$/, "")}/api/v1`;
}

const API_BASE_URL = getApiBaseUrl();

export async function loginUser(email: string, password: string) {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    console.warn("WARNING: NEXT_PUBLIC_API_BASE_URL is not defined in .env file. Falling back to localhost.");
  }
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    return { error: data?.message || "Invalid credentials provided." };
  }

  if (data?.resources?.token) {
    const cookieStore = await cookies();
    cookieStore.set("admin_token", data.resources.token, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return data;
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  redirect("/admin/login");
}

export async function forgotPassword(email: string) {
  const response = await fetch(`${API_BASE_URL}/admin/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    return { error: data?.message || "Something went wrong." };
  }

  return data;
}

export async function resetPassword(formData: any) {
  const response = await fetch(`${API_BASE_URL}/admin/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    return { error: data?.message || "Something went wrong." };
  }

  return data;
}
