import type { Metadata } from "next";
import { ContactsPage } from "@/components/site/contacts-page";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Контакты KartoFert: телефон, почта, доставка по Беларуси и форма для вопросов по подбору удобрений, расчёту количества и оформлению заказа."
};

export default function ContactsRoute() {
  return <ContactsPage />;
}
