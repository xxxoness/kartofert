import Link from "next/link";
import type React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CheckCircle2 } from "lucide-react";
import { Article } from "@/data/articles";
import { products } from "@/data/products";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function ArticleLayout({ article }: { article: Article }) {
  const content = article.content?.trim() || article.sections.map((section) => `## ${section.heading}\n\n${section.paragraphs.join("\n\n")}`).join("\n\n");
  const toc = extractTableOfContents(content);
  const relatedProducts = products.filter((product) => article.relatedProductSlugs.includes(product.slug));

  return (
    <>
      <article className="container-shell py-10 md:py-14">
        <div className="mx-auto max-w-[860px]">
          <span className="rounded-[8px] bg-[#fff1be] px-3 py-1.5 text-xs font-black text-[#8c5b00]">{article.category}</span>
          <h1 className="mt-6 text-[38px] font-black leading-[1] tracking-[-0.06em] text-[#071a10] md:text-[62px]">{article.title}</h1>
          <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-[#6a7566]">
            <span>{article.date}</span>
            <span>{article.readTime}</span>
            <span>KartoFert</span>
          </div>
          <p className="mt-6 text-xl leading-9 text-[#4d5a4e]">{article.excerpt}</p>

          {toc.length ? (
            <nav className="mt-8 rounded-[18px] border border-[#173c25]/10 bg-white p-6 shadow-[0_14px_34px_rgba(45,35,17,.05)]" aria-label="Содержание статьи">
              <h2 className="font-black text-[#102116]">Содержание</h2>
              <ol className="mt-3 grid gap-2 text-sm font-semibold text-[#596553]">
                {toc.map((item, index) => (
                  <li key={item.id} className={item.level === 3 ? "pl-4" : ""}>
                    <a href={`#${item.id}`} className="transition hover:text-[#063b23]">
                      {index + 1}. {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          <MarkdownArticle content={content} />

          <OptionalBlocks article={article} />

          <Button asChild className="mt-8 h-12 rounded-[10px] bg-[#f5b400] px-8 text-[#1b1500] shadow-none hover:bg-[#e8a900]">
            <Link href="/contacts">Получить консультацию</Link>
          </Button>
        </div>
      </article>

      {relatedProducts.length ? (
        <section className="container-shell pb-16">
          <h2 className="text-3xl font-black tracking-[-0.04em] text-[#102116]">Связанные удобрения</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

function MarkdownArticle({ content }: { content: string }) {
  return (
    <div className="article-prose mt-10">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => {
            const text = flattenText(children);
            return (
              <h2 id={slugify(text)} className="scroll-mt-28 pt-3 text-[30px] font-black leading-tight tracking-[-0.04em] text-[#102116] md:text-[36px]">
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const text = flattenText(children);
            return (
              <h3 id={slugify(text)} className="scroll-mt-28 pt-2 text-2xl font-black leading-tight tracking-[-0.03em] text-[#102116]">
                {children}
              </h3>
            );
          },
          p: ({ children }) => <p className="text-lg font-medium leading-[1.78] text-[#4f5a49]">{children}</p>,
          ul: ({ children }) => <ul className="ml-6 list-disc space-y-2 text-lg font-medium leading-[1.72] text-[#4f5a49]">{children}</ul>,
          ol: ({ children }) => <ol className="ml-6 list-decimal space-y-2 text-lg font-medium leading-[1.72] text-[#4f5a49]">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          strong: ({ children }) => <strong className="font-black text-[#102116]">{children}</strong>,
          a: ({ children, href }) => (
            <a href={href} className="font-black text-[#063b23] underline decoration-[#f5b400]/70 underline-offset-4">
              {children}
            </a>
          ),
          table: ({ children }) => <div className="overflow-x-auto rounded-[16px] border border-[#173c25]/10 bg-white"><table className="w-full text-left text-sm">{children}</table></div>,
          th: ({ children }) => <th className="border-b border-[#173c25]/10 bg-[#fff8df] px-4 py-3 font-black text-[#102116]">{children}</th>,
          td: ({ children }) => <td className="border-b border-[#173c25]/10 px-4 py-3 font-semibold text-[#4f5a49]">{children}</td>
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function OptionalBlocks({ article }: { article: Article }) {
  const hasTips = article.tips.length > 0;
  const hasMistakes = article.mistakes.length > 0;
  const hasChecklist = article.checklist.length > 0;
  const hasAdvice = article.agronomistAdvice.trim().length > 0;

  if (!hasTips && !hasMistakes && !hasChecklist && !hasAdvice) return null;

  return (
    <>
      {(hasTips || hasMistakes) && (
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {hasTips ? <InfoList title="Практические советы" items={article.tips} /> : null}
          {hasMistakes ? <InfoList title="Частые ошибки" items={article.mistakes} warn /> : null}
        </div>
      )}

      {hasChecklist ? (
        <div className="mt-6 rounded-[18px] border border-[#f5b400]/30 bg-[#fff3d8] p-6">
          <h2 className="text-2xl font-black tracking-[-0.035em] text-[#102116]">Чек-лист перед покупкой</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {article.checklist.map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-[12px] bg-white/75 px-4 py-3 text-sm font-bold text-[#3f493a]">
                <CheckCircle2 className="h-4 w-4 text-[#1f7a45]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {hasAdvice ? (
        <div className="mt-6 rounded-[18px] bg-[#063b23] p-6 text-white">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#f5b400]">Важно</p>
          <p className="mt-3 text-lg leading-8 text-white/84">{article.agronomistAdvice}</p>
        </div>
      ) : null}
    </>
  );
}

function InfoList({ title, items, warn }: { title: string; items: string[]; warn?: boolean }) {
  return (
    <div className={warn ? "rounded-[18px] bg-[#fff3d8] p-6" : "rounded-[18px] border border-[#173c25]/10 bg-white p-6 shadow-[0_14px_34px_rgba(45,35,17,.05)]"}>
      <h2 className="text-2xl font-black tracking-[-0.035em] text-[#102116]">{title}</h2>
      <ul className="mt-4 grid gap-3">
        {items.map((item) => (
          <li key={item} className="text-sm leading-6 text-[#4f5a49]">• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function extractTableOfContents(content: string): TocItem[] {
  return content
    .split(/\r?\n/)
    .map((line) => {
      const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
      if (!match) return null;
      const text = match[2].replace(/[*_`]/g, "").trim();
      return { id: slugify(text), text, level: match[1].length as 2 | 3 };
    })
    .filter((item): item is TocItem => Boolean(item));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function flattenText(children: React.ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(flattenText).join("");
  return "";
}
