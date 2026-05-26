import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = { title: "Документы на продукцию" };

export default function DocumentsPage() {
  return <LegalPage slug="documents" />;
}
