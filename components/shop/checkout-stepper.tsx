type CheckoutStep = "cart" | "details" | "payment";

const steps: Array<{ id: CheckoutStep; number: string; label: string }> = [
  { id: "cart", number: "1", label: "Корзина" },
  { id: "details", number: "2", label: "Данные" },
  { id: "payment", number: "3", label: "Оплата" }
];

export function CheckoutStepper({ active }: { active: CheckoutStep }) {
  return (
    <div className="flex flex-wrap gap-2">
      {steps.map((step) => {
        const isActive = step.id === active;
        return (
          <div
            key={step.id}
            className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-black ${
              isActive
                ? "border-[#f5b400] bg-[#fff1be] text-[#102116]"
                : "border-[#173c25]/10 bg-white text-[#65705e]"
            }`}
          >
            <span className={`grid h-6 w-6 place-items-center rounded-full text-xs ${isActive ? "bg-[#063b23] text-white" : "bg-[#f6f1e7] text-[#65705e]"}`}>
              {step.number}
            </span>
            {step.label}
          </div>
        );
      })}
    </div>
  );
}
