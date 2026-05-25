"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { potatoStages } from "@/lib/data";
import { Progress } from "@/components/ui/progress";

export function PotatoTimeline() {
  const [active, setActive] = useState(0);
  const stage = potatoStages[active];

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
      <div className="rounded-[8px] border border-white/10 bg-white/[0.06] p-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-sm text-stone-400">Этап {active + 1} из {potatoStages.length}</p>
          <p className="text-sm text-emerald-100">{Math.round(((active + 1) / potatoStages.length) * 100)}%</p>
        </div>
        <Progress value={((active + 1) / potatoStages.length) * 100} />
        <div className="mt-6 grid gap-2">
          {potatoStages.map((item, index) => (
            <button
              key={item.stage}
              onClick={() => setActive(index)}
              className={`flex items-center gap-3 rounded-[8px] px-4 py-3 text-left transition ${
                active === index ? "bg-emerald-300 text-emerald-950" : "bg-white/[0.04] text-stone-300 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/10 text-sm font-semibold">{index + 1}</span>
              <span className="font-medium">{item.stage}</span>
            </button>
          ))}
        </div>
      </div>
      <motion.div
        key={stage.stage}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[8px] border border-emerald-200/18 bg-[linear-gradient(145deg,rgba(255,255,255,.08),rgba(16,55,36,.28))] p-7"
      >
        <h3 className="text-3xl font-semibold text-white">{stage.stage}</h3>
        <div className="mt-6 grid gap-4">
          {[
            ["Цель", stage.goal],
            ["Рекомендованный тип", stage.fertilizer],
            ["Способ внесения", stage.method],
            ["Ожидаемый эффект", stage.effect],
            ["Совет эксперта", stage.tip]
          ].map(([label, value]) => (
            <div key={label} className="rounded-[8px] bg-black/18 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-100">
                <CheckCircle2 className="h-4 w-4" />
                {label}
              </div>
              <p className="leading-7 text-stone-200">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
