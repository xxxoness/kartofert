"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

const CONSENT_KEY = "kartofert_cookie_consent";

export function CookieConsent() {
  const [consent, setConsent] = useState<"accepted" | "declined" | null>(null);
  const metrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (stored === "accepted" || stored === "declined") setConsent(stored);
  }, []);

  const save = (value: "accepted" | "declined") => {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  };

  return (
    <>
      {consent === "accepted" && metrikaId ? <YandexMetrika id={metrikaId} /> : null}
      {consent === null ? (
        <div className="fixed bottom-4 left-4 right-4 z-[80] mx-auto max-w-5xl rounded-[22px] border border-[#173c25]/10 bg-white p-4 text-[#102116] shadow-[0_24px_80px_rgba(45,35,17,.18)] md:flex md:items-center md:gap-5">
          <p className="text-sm font-semibold leading-6 text-[#4f5e4f]">
            Мы используем cookie и Яндекс Метрику, чтобы анализировать посещаемость, улучшать сайт и работу форм. Нажимая
            «Принять», вы соглашаетесь с использованием cookie в соответствии с{" "}
            <Link href="/cookie" className="font-black text-[#063b23] underline">
              Политикой cookie
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row md:mt-0 md:shrink-0">
            <button onClick={() => save("accepted")} className="h-11 rounded-[12px] bg-[#063b23] px-5 text-sm font-black text-white">
              Принять
            </button>
            <button onClick={() => save("declined")} className="h-11 rounded-[12px] border border-[#173c25]/10 bg-white px-5 text-sm font-black text-[#063b23]">
              Отклонить
            </button>
            <Link href="/cookie" className="inline-flex h-11 items-center justify-center rounded-[12px] border border-[#f5b400] bg-[#fff8dc] px-5 text-sm font-black text-[#102116]">
              Подробнее
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}

function YandexMetrika({ id }: { id: string }) {
  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
          ym(${id}, "init", { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true, ecommerce: "dataLayer" });
        `}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://mc.yandex.ru/watch/${id}`} style={{ position: "absolute", left: "-9999px" }} alt="" />
        </div>
      </noscript>
    </>
  );
}
