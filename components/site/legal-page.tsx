import Link from "next/link";
import { getLegalDocumentHtml, getLegalDocumentMeta, LegalDocumentSlug } from "@/lib/legal-documents";

export async function LegalPage({ slug }: { slug: LegalDocumentSlug }) {
  const document = getLegalDocumentMeta(slug);
  const html = await getLegalDocumentHtml(slug);

  return (
    <main className="bg-[#fbf7ec] text-[#102116]">
      <section className="container-shell py-10 md:py-14">
        <div className="mb-6 flex items-center gap-2 text-sm font-bold text-[#65705f]">
          <Link href="/" className="transition hover:text-[#063b23]">
            Главная
          </Link>
          <span>/</span>
          <span className="text-[#102116]">{document.title}</span>
        </div>
        <article className="rounded-[28px] border border-[#173c25]/10 bg-white p-6 shadow-[0_20px_54px_rgba(45,35,17,.07)] md:p-10">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8c5b00]">Документы</span>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.055em] text-[#063b23] md:text-6xl">{document.title}</h1>
          <p className="mt-5 max-w-3xl text-base font-semibold leading-7 text-[#596553]">{document.description}</p>
          <div
            className="mt-8 max-w-none text-[#243427] [&_h1]:mt-8 [&_h1]:text-3xl [&_h1]:font-black [&_h1]:tracking-[-0.04em] [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:tracking-[-0.035em] [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-black [&_p]:mt-3 [&_p]:text-sm [&_p]:font-semibold [&_p]:leading-7 [&_p]:text-[#596553] [&_table]:mt-5 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[#173c25]/10 [&_td]:p-3 [&_td]:align-top [&_td]:text-sm [&_td]:font-semibold [&_td]:leading-6 [&_td]:text-[#596553] [&_th]:border [&_th]:border-[#173c25]/10 [&_th]:bg-[#fbf7ec] [&_th]:p-3 [&_th]:text-left [&_th]:text-sm [&_th]:font-black"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </section>
    </main>
  );
}
