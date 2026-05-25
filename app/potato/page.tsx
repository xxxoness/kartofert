import type { Metadata } from "next";
import { FertilizersPage } from "@/components/shop/fertilizers-page";

export const metadata: Metadata = {
  title: "Удобрения для картофеля по этапам выращивания | KartoFert",
  description: "Подбор удобрений KartoFert по этапам выращивания картофеля: подготовка почвы, посадка, вегетация, клубнеобразование и период перед уборкой."
};

export default function PotatoPage() {
  return <FertilizersPage />;
}
