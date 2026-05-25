"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addLead } from "@/components/shop/leads-store";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const phone = String(form.get("phone") ?? "");
    if (name.trim().length < 2 || phone.trim().length < 7) {
      setError("Укажите имя и телефон");
      return;
    }
    addLead({
      source: "форма",
      name,
      phone,
      email: String(form.get("email") ?? ""),
      productName: String(form.get("culture") ?? ""),
      amount: String(form.get("area") ?? ""),
      comment: String(form.get("comment") ?? "")
    });
    setSent(true);
    setError("");
    event.currentTarget.reset();
  };

  if (sent) {
    return (
      <div className="rounded-[18px] border border-[#c8dfb8] bg-[#edf4e6] p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-[#1f7a45]" />
        <h3 className="mt-4 text-2xl font-black text-[#102116]">Заявка отправлена</h3>
        <p className="mt-3 text-[#5e6858]">Менеджер свяжется с вами и уточнит удобрение, площадь и условия доставки.</p>
        <Button className="mt-6 rounded-[10px] bg-[#063b23] text-white hover:bg-[#0d5a36]" onClick={() => setSent(false)}>
          Отправить ещё одну заявку
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Имя"><input name="name" placeholder="Ваше имя" className="field-input" /></Field>
        <Field label="Телефон"><input name="phone" placeholder="+375 ..." className="field-input" /></Field>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Электронная почта"><input name="email" type="email" placeholder="pochta@example.by" className="field-input" /></Field>
        <Field label="Культура">
          <select name="culture" className="field-input">
            <option>Картофель</option>
            <option>Томаты</option>
            <option>Огурцы</option>
            <option>Капуста</option>
            <option>Клубника</option>
            <option>Зелень</option>
          </select>
        </Field>
      </div>
      <Field label="Площадь">
        <input name="area" placeholder="Например, 25 соток или 2 га" className="field-input" />
      </Field>
      <Field label="Комментарий">
        <textarea name="comment" placeholder="Опишите задачу, почву, сроки доставки или вопросы по товарам" className="min-h-32 resize-none rounded-[12px] border border-[#173c25]/10 bg-white px-4 py-3 font-semibold text-[#102116] outline-none focus:border-[#f5b400]" />
      </Field>
      {error ? <p className="rounded-[10px] bg-[#fff1e8] px-4 py-3 text-sm font-bold text-[#8c3d22]">{error}</p> : null}
      <Button type="submit" size="lg" className="h-12 rounded-[10px] bg-[#f5b400] text-[#1b1500] shadow-none hover:bg-[#e8a900]">
        Получить консультацию
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-black text-[#384334]">
      {label}
      {children}
    </label>
  );
}
