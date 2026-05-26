import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import mammoth from "mammoth";

export type LegalDocumentSlug = "policy" | "cookie" | "terms" | "returns" | "documents";

const legalDocuments: Record<
  LegalDocumentSlug,
  {
    title: string;
    description: string;
    fileName: string;
  }
> = {
  policy: {
    title: "Политика обработки персональных данных",
    description: "Порядок обработки персональных данных на сайте KartoFert.",
    fileName: "politika_obrabotki_personalnyh_dannyh_kartofert.docx"
  },
  cookie: {
    title: "Политика cookie",
    description: "Порядок использования cookie и аналитических инструментов на сайте KartoFert.",
    fileName: "politika_cookie_kartofert.docx"
  },
  terms: {
    title: "Условия заказа и продажи",
    description: "Условия выбора товаров, уточнения цены, оформления заказа, оплаты и доставки.",
    fileName: "usloviya_zakaza_i_prodazhi_kartofert.docx"
  },
  returns: {
    title: "Возврат, обмен и отмена заказа",
    description: "Порядок отмены заказа, возврата, обмена и рассмотрения обращений покупателей.",
    fileName: "vozvrat_obmen_otmena_zakaza_kartofert.docx"
  },
  documents: {
    title: "Документы на продукцию",
    description: "Порядок предоставления документов, паспортов качества и сведений о продукции.",
    fileName: "dokumenty_na_produkciyu_kartofert.docx"
  }
};

export function getLegalDocumentMeta(slug: LegalDocumentSlug) {
  return legalDocuments[slug];
}

export async function getLegalDocumentHtml(slug: LegalDocumentSlug) {
  const document = legalDocuments[slug];
  const filePath = path.join(process.cwd(), "docs", "legal", document.fileName);

  try {
    await fs.access(filePath);
    const result = await mammoth.convertToHtml({ path: filePath });
    return result.value;
  } catch (error) {
    console.error(`[legal-documents] ${document.fileName}`, error);
    return `<p>Текст документа временно недоступен. Пожалуйста, свяжитесь с нами по email kartofert.by@gmail.com.</p>`;
  }
}
