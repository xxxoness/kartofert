import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = { title: "Политика обработки персональных данных" };

export default function PolicyPage() {
  return <LegalPage slug="policy" />;
}
