export type CalculatorInput = {
  crop: string;
  area: number;
  soil: string;
  yieldGoal: number;
  method: string;
  cultivation: string;
  budget?: number;
};

const cropRate: Record<string, number> = {
  Картофель: 235,
  Томаты: 110,
  Огурцы: 95,
  Капуста: 185,
  Зерновые: 210,
  Ягоды: 72,
  "Тепличные культуры": 58
};

const soilFactor: Record<string, number> = {
  "Легкая песчаная": 1.12,
  "Суглинистая": 1,
  "Торфяная": 0.92,
  "Тяжелая глинистая": 1.05
};

export function calculateProgram(input: CalculatorInput) {
  const base = cropRate[input.crop] ?? 120;
  const soil = soilFactor[input.soil] ?? 1;
  const intensity = Math.max(0.85, Math.min(1.35, input.yieldGoal / 45));
  const amount = Math.round(input.area * base * soil * intensity);
  const pricePerKg = input.crop === "Тепличные культуры" ? 4.8 : input.crop === "Ягоды" ? 3.6 : 2.15;
  const cost = Math.round(amount * pricePerKg);

  return {
    amount,
    cost,
    products:
      input.crop === "Картофель"
        ? ["Картофель Профи Старт", "Калий Тубер Плюс", "Микро Лист Агро"]
        : input.crop === "Тепличные культуры"
          ? ["Теплица Вег Баланс", "Микро Лист Агро", "Рут Стим Проф"]
          : ["Универсал Агро Микс", "Микро Лист Агро", "Гумус Актив Почва"],
    schedule: [
      "До посадки: подготовка почвы и базовое питание",
      "Старт роста: локальное или корневое внесение",
      "Активная вегетация: листовая корректировка микроэлементами",
      "Формирование урожая: калийно-магниевая поддержка"
    ],
    recommendation:
      input.budget && input.budget < cost
        ? "Бюджет ниже расчетного. Рекомендуем сохранить стартовое питание и микроэлементы, а калийную часть разделить по приоритетным участкам."
        : "Программа выглядит сбалансированной для заявленной площади. Для точной нормы стоит учесть анализ почвы и фактическую обеспеченность калием."
  };
}
