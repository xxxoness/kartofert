import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = { title: "Возврат, обмен и отмена заказа" };

export default function ReturnsPage() {
  return <LegalPage slug="returns" />;
}
