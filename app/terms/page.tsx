import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = { title: "Условия заказа и продажи" };

export default function TermsPage() {
  return <LegalPage slug="terms" />;
}
