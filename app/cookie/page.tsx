import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = { title: "Политика cookie" };

export default function CookiePage() {
  return <LegalPage slug="cookie" />;
}
