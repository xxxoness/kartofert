"use server";

import { redirect } from "next/navigation";
import { clearAdminSession, setAdminSession, verifyAdminCredentials } from "@/lib/admin-auth";

export type AdminLoginState = {
  error?: string;
};

export async function loginAdmin(_: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  if (!verifyAdminCredentials(email, password)) {
    return { error: "Неверная почта или пароль" };
  }

  await setAdminSession(email.trim().toLowerCase());
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}
