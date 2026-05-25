"use client";

import { useMemo, useState } from "react";
import { Calculator, Send } from "lucide-react";
import { calculateProgram } from "@/lib/calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const crops = ["Картофель", "Томаты", "Огурцы", "Капуста", "Зерновые", "Ягоды", "Тепличные культуры"];
const soils = ["Легкая песчаная", "Суглинистая", "Торфяная", "Тяжелая глинистая"];
const methods = ["Разбрасывание", "Локальное внесение", "Капельный полив", "Листовая обработка"];
const cultivations = ["Открытый грунт", "Теплица", "Фермерское поле", "Садовый участок"];

export function FertilizerCalculator() {
  const [crop, setCrop] = useState("Картофель");
  const [area, setArea] = useState(12);
  const [soil, setSoil] = useState("Суглинистая");
  const [yieldGoal, setYieldGoal] = useState(45);
  const [method, setMethod] = useState("Локальное внесение");
  const [cultivation, setCultivation] = useState("Фермерское поле");
  const [budget, setBudget] = useState(0);

  const result = useMemo(
    () => calculateProgram({ crop, area, soil, yieldGoal, method, cultivation, budget: budget || undefined }),
    [area, budget, crop, cultivation, method, soil, yieldGoal]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-emerald-200" />
            Параметры расчета
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <CalcSelect label="Культура" value={crop} onChange={setCrop} items={crops} />
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label>Площадь, га</Label>
              <span className="text-sm text-emerald-100">{area} га</span>
            </div>
            <Slider value={[area]} min={1} max={250} step={1} onValueChange={(value) => setArea(value[0])} />
          </div>
          <CalcSelect label="Тип почвы" value={soil} onChange={setSoil} items={soils} />
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label>План урожайности, т/га</Label>
              <span className="text-sm text-emerald-100">{yieldGoal} т/га</span>
            </div>
            <Slider value={[yieldGoal]} min={15} max={85} step={1} onValueChange={(value) => setYieldGoal(value[0])} />
          </div>
          <CalcSelect label="Способ внесения" value={method} onChange={setMethod} items={methods} />
          <CalcSelect label="Тип выращивания" value={cultivation} onChange={setCultivation} items={cultivations} />
          <div>
            <Label htmlFor="budget">Бюджет, бел. руб. (необязательно)</Label>
            <Input id="budget" type="number" min={0} value={budget || ""} onChange={(event) => setBudget(Number(event.target.value))} placeholder="Например, 12000" className="mt-2" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[linear-gradient(145deg,rgba(32,80,53,.65),rgba(255,255,255,.055))]">
        <CardHeader>
          <CardTitle>Рекомендуемая программа</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultMetric label="Ориентировочный объем" value={`${result.amount.toLocaleString("ru-BY")} кг`} />
            <ResultMetric label="Ориентировочная стоимость" value={`${result.cost.toLocaleString("ru-BY")} бел. руб.`} />
          </div>
          <div className="mt-6 rounded-[8px] bg-black/18 p-5">
            <h3 className="font-semibold text-white">Продукты в программе</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.products.map((item) => (
                <span key={item} className="rounded-full bg-emerald-300/14 px-3 py-1 text-sm text-emerald-50">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6 rounded-[8px] bg-black/18 p-5">
            <h3 className="font-semibold text-white">График внесения</h3>
            <ol className="mt-4 grid gap-3">
              {result.schedule.map((item, index) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-stone-300">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-xs font-semibold text-emerald-950">{index + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-6 rounded-[8px] border border-amber-200/20 bg-amber-200/10 p-5">
            <h3 className="font-semibold text-amber-50">Рекомендация эксперта</h3>
            <p className="mt-2 text-sm leading-7 text-amber-50/82">{result.recommendation}</p>
          </div>
          <Button className="mt-6 w-full" size="lg">
            <Send className="h-4 w-4" />
            Отправить заявку на расчет
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function CalcSelect({ label, value, onChange, items }: { label: string; value: string; onChange: (value: string) => void; items: string[] }) {
  return (
    <div>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-white/10 bg-black/18 p-5">
      <p className="text-sm text-stone-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
