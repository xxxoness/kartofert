"use client";

import { motion } from "framer-motion";
import { stats } from "@/lib/data";

export function StatsGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 }}
          className="rounded-[8px] border border-white/10 bg-white/[0.06] p-5"
        >
          <p className="text-3xl font-semibold text-white">{item.value}</p>
          <p className="mt-2 text-sm leading-6 text-stone-400">{item.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
