import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Article } from "@/data/articles";
import { products } from "@/data/products";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";

export function ArticleLayout({ article }: { article: Article }) {
  const relatedProducts = products.filter((product) => article.relatedProductSlugs.includes(product.slug));

  return (
    <>
      <article className="container-shell py-10 md:py-14">
        <div className="mx-auto max-w-4xl">
          <span className="rounded-[8px] bg-[#fff1be] px-3 py-1.5 text-xs font-black text-[#8c5b00]">{article.category}</span>
          <h1 className="mt-6 text-[38px] font-black leading-[1] tracking-[-0.06em] text-[#071a10] md:text-[62px]">{article.title}</h1>
          <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-[#6a7566]">
            <span>{article.date}</span>
            <span>{article.readTime}</span>
            <span>KartoFert</span>
          </div>
          <p className="mt-6 text-xl leading-9 text-[#4d5a4e]">{article.excerpt}</p>

          <div className="mt-8 rounded-[18px] border border-[#173c25]/10 bg-white p-6 shadow-[0_14px_34px_rgba(45,35,17,.05)]">
            <h2 className="font-black text-[#102116]">Содержание</h2>
            <ol className="mt-3 grid gap-2 text-sm font-semibold text-[#596553]">
              {article.sections.map((section, index) => (
                <li key={section.heading}>{index + 1}. {section.heading}</li>
              ))}
              <li>{article.sections.length + 1}. Чек-лист перед покупкой</li>
            </ol>
          </div>

          <div className="mt-8 grid gap-8">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-3xl font-black tracking-[-0.04em] text-[#102116]">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4 text-lg leading-9 text-[#4f5a49]">{paragraph}</p>
                ))}
              </section>
            ))}
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <InfoList title="Практические советы" items={article.tips} />
            <InfoList title="Частые ошибки" items={article.mistakes} warn />
          </div>

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

          <div className="mt-6 rounded-[18px] bg-[#063b23] p-6 text-white">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#f5b400]">Важно</p>
            <p className="mt-3 text-lg leading-8 text-white/84">{article.agronomistAdvice}</p>
          </div>

          <Button asChild className="mt-8 h-12 rounded-[10px] bg-[#f5b400] px-8 text-[#1b1500] shadow-none hover:bg-[#e8a900]">
            <Link href="/contacts">Получить консультацию</Link>
          </Button>
        </div>
      </article>

      <section className="container-shell pb-16">
        <h2 className="text-3xl font-black tracking-[-0.04em] text-[#102116]">Связанные удобрения</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {relatedProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}

function InfoList({ title, items, warn }: { title: string; items: string[]; warn?: boolean }) {
  return (
    <div className={warn ? "rounded-[18px] bg-[#fff3d8] p-6" : "rounded-[18px] border border-[#173c25]/10 bg-white p-6 shadow-[0_14px_34px_rgba(45,35,17,.05)]"}>
      <h2 className="flex items-center gap-2 text-2xl font-black tracking-[-0.035em] text-[#102116]">
        {warn ? <AlertTriangle className="h-5 w-5 text-[#b77800]" /> : null}
        {title}
      </h2>
      <ul className="mt-4 grid gap-3">
        {items.map((item) => (
          <li key={item} className="text-sm leading-6 text-[#4f5a49]">• {item}</li>
        ))}
      </ul>
    </div>
  );
}
