export type NutritionElement = {
  symbol: string;
  label: string;
  value?: string;
};

export type Product = {
  id?: string;
  slug: string;
  name: string;
  shortName: string;
  brand: string;
  category: string;
  fertilizerType: string;
  typeGroup: string;
  tasks: string[];
  elements: NutritionElement[];
  stage: string[];
  packageSize: string;
  bagWeight: number;
  price?: number;
  priceLabel?: string | null;
  priceMode?: string | null;
  currency?: string;
  image?: string | null;
  imageUrl?: string | null;
  isPublished?: boolean;
  formula?: string;
  bagTitle: string;
  bagSubtitle: string;
  bagTheme:
    | "npk-potato"
    | "azofoska"
    | "diammofoska"
    | "ammofos"
    | "superfosfat"
    | "sulfat-kaliya"
    | "kalimagneziya"
    | "monofosfat"
    | "kalievaya-selitra"
    | "sulfat-ammoniya"
    | "ammiachnaya-selitra"
    | "karbamid"
    | "borofoska"
    | "dolomit"
    | "zola";
  shortDescription: string;
  description: string;
  mainAction: string;
  advantages: string[];
  important: string[];
  application: string;
  dosage: string;
  defaultNorm: number;
  normUnit: "кг/га" | "г/м²" | "кг/сотка";
  recommendedRange: string;
  tags: string[];
  inStock: boolean;
  imageTone: "green" | "gold" | "blue" | "brown" | "rose" | "neutral";
  crops: string[];
};

export type ProductData = Product;

const base = {
  brand: "KartoFert",
  packageSize: "25 кг",
  bagWeight: 25,
  inStock: true,
  crops: ["Картофель"]
};

export const products: Product[] = [
  {
    ...base,
    slug: "npk-potato",
    name: "Комплексное NPK для картофеля",
    shortName: "NPK 11-9-16",
    category: "Комплексные NPK",
    fertilizerType: "Комплексное",
    typeGroup: "Комплексные NPK",
    tasks: ["Рост и развитие", "Повышение урожайности", "Качество клубней"],
    elements: [
      { symbol: "N", label: "Азот", value: "11%" },
      { symbol: "P₂O₅", label: "Фосфор", value: "9%" },
      { symbol: "K₂O", label: "Калий", value: "16%" }
    ],
    stage: ["Подготовка почвы", "Посадка", "Вегетация"],
    formula: "11-9-16",
    bagTitle: "NPK",
    bagSubtitle: "для картофеля",
    bagTheme: "npk-potato",
    shortDescription: "Сбалансированное питание для базовой схемы посадки и начала сезона.",
    description: "Комплексное NPK используют, когда нужно дать картофелю основные элементы питания в одной грануле. Подходит для стартовой программы на участке или в хозяйстве.",
    mainAction: "Поддерживает стартовое развитие, формирование ботвы и переход к клубнеобразованию.",
    advantages: ["Сбалансированная формула", "Удобно считать в сотках и гектарах", "Подходит для базового внесения"],
    important: ["Учитывайте анализ почвы", "Не превышайте норму с упаковки", "Вносите равномерно и заделывайте в почву"],
    application: "Основное внесение при подготовке почвы или локально при посадке по инструкции.",
    dosage: "Ориентировочно 120–180 кг/га. Точную норму задавайте вручную в калькуляторе.",
    defaultNorm: 160,
    normUnit: "кг/га",
    recommendedRange: "120–180 кг/га",
    tags: ["NPK", "картофель", "комплексное"],
    imageTone: "green"
  },
  {
    ...base,
    slug: "nitroammofoska-azofoska",
    name: "Нитроаммофоска / азофоска NPK",
    shortName: "NPK 16-16-16",
    category: "Комплексные NPK",
    fertilizerType: "Комплексное",
    typeGroup: "Комплексные NPK",
    tasks: ["Рост и развитие", "Повышение урожайности"],
    elements: [
      { symbol: "N", label: "Азот", value: "16%" },
      { symbol: "P", label: "Фосфор", value: "16%" },
      { symbol: "K", label: "Калий", value: "16%" }
    ],
    stage: ["Подготовка почвы", "Посадка"],
    formula: "16-16-16",
    bagTitle: "NPK",
    bagSubtitle: "для всех типов почв",
    bagTheme: "azofoska",
    shortDescription: "Универсальная комплексная формула для основного внесения.",
    description: "Нитроаммофоска и азофоска применяются как универсальные NPK-удобрения с азотом, фосфором и калием. Для картофеля важно не завышать азотную часть схемы.",
    mainAction: "Даёт базовый набор элементов питания для роста и закладки урожая.",
    advantages: ["Универсальная формула", "Понятная гранулированная форма", "Подходит для подготовки участка"],
    important: ["Сверяйте фактическую марку", "Не смешивайте с золой без проверки", "Норма зависит от обеспеченности почвы"],
    application: "Основное внесение перед посадкой или при подготовке участка.",
    dosage: "Норма зависит от марки и инструкции поставщика.",
    defaultNorm: 150,
    normUnit: "кг/га",
    recommendedRange: "100–180 кг/га",
    tags: ["NPK", "азофоска", "нитроаммофоска"],
    imageTone: "blue"
  },
  {
    ...base,
    slug: "diammofoska",
    name: "Диаммофоска",
    shortName: "NPK 10-26-26",
    category: "Комплексные NPK",
    fertilizerType: "Комплексное",
    typeGroup: "Комплексные NPK",
    tasks: ["Повышение урожайности", "Качество клубней"],
    elements: [
      { symbol: "N", label: "Азот", value: "10%" },
      { symbol: "P", label: "Фосфор", value: "26%" },
      { symbol: "K", label: "Калий", value: "26%" }
    ],
    stage: ["Подготовка почвы", "Посадка"],
    formula: "10-26-26",
    bagTitle: "NPK",
    bagSubtitle: "для картофеля",
    bagTheme: "diammofoska",
    shortDescription: "Фосфорно-калийный акцент для стартовой подготовки почвы.",
    description: "Диаммофоска содержит азот, фосфор и калий с повышенной долей фосфора и калия. Подходит для основного внесения, когда нужен сильный старт.",
    mainAction: "Помогает сформировать корневую систему и поддержать будущую закладку клубней.",
    advantages: ["Повышенный фосфор", "Повышенный калий", "Невысокая доля азота"],
    important: ["Проверяйте марку удобрения", "Не вносите концентрат прямо на клубень", "Учитывайте данные почвы"],
    application: "Внесение до посадки с равномерной заделкой.",
    dosage: "Норма уточняется по инструкции и анализу почвы.",
    defaultNorm: 140,
    normUnit: "кг/га",
    recommendedRange: "90–160 кг/га",
    tags: ["диаммофоска", "фосфор", "калий"],
    imageTone: "neutral"
  },
  {
    ...base,
    slug: "ammofos",
    name: "Аммофос",
    shortName: "NP 12-52",
    category: "Фосфорные удобрения",
    fertilizerType: "Фосфорное",
    typeGroup: "Фосфорные",
    tasks: ["Рост и развитие", "Повышение урожайности"],
    elements: [
      { symbol: "N", label: "Азот", value: "12%" },
      { symbol: "P", label: "Фосфор", value: "52%" }
    ],
    stage: ["Посадка"],
    formula: "12-52",
    bagTitle: "NP",
    bagSubtitle: "для картофеля",
    bagTheme: "ammofos",
    shortDescription: "Фосфорное питание для старта корневой системы.",
    description: "Аммофос используют как источник фосфора и небольшого количества азота, особенно при стартовом питании картофеля.",
    mainAction: "Поддерживает развитие корней и начальное питание растений.",
    advantages: ["Высокий фосфор", "Подходит для старта", "Удобен в схемах посадки"],
    important: ["Не заменяет калийное питание", "Учитывайте кислотность почвы", "Сверяйте норму с инструкцией"],
    application: "Локальное или основное внесение по инструкции.",
    dosage: "Норма уточняется по инструкции производителя.",
    defaultNorm: 80,
    normUnit: "кг/га",
    recommendedRange: "50–120 кг/га",
    tags: ["аммофос", "фосфор", "старт"],
    imageTone: "rose"
  },
  {
    ...base,
    slug: "superfosfat",
    name: "Суперфосфат",
    shortName: "P₂O₅ 19-20",
    category: "Фосфорные удобрения",
    fertilizerType: "Фосфорное",
    typeGroup: "Фосфорные",
    tasks: ["Рост и развитие", "Корректировка почвы"],
    elements: [
      { symbol: "P₂O₅", label: "Фосфор", value: "19–20%" },
      { symbol: "Ca", label: "Кальций" }
    ],
    stage: ["Подготовка почвы", "Посадка"],
    formula: "19-20",
    bagTitle: "P₂O₅",
    bagSubtitle: "для картофеля",
    bagTheme: "superfosfat",
    shortDescription: "Источник фосфора для подготовки почвы и посадки.",
    description: "Суперфосфат используют для фосфорного питания и поддержки корневой системы картофеля.",
    mainAction: "Помогает корневой системе работать на старте сезона.",
    advantages: ["Фосфорное питание", "Подходит для подготовки почвы", "Классический продукт"],
    important: ["Действует постепенно", "Не смешивайте со щелочными материалами без проверки", "Смотрите инструкцию"],
    application: "Внесение в почву до посадки или при посадке.",
    dosage: "Норма зависит от формы суперфосфата и почвы.",
    defaultNorm: 120,
    normUnit: "кг/га",
    recommendedRange: "80–160 кг/га",
    tags: ["суперфосфат", "фосфор", "кальций"],
    imageTone: "blue"
  },
  {
    ...base,
    slug: "sulfate-potassium",
    name: "Сульфат калия",
    shortName: "K₂O 50%",
    category: "Калийные удобрения",
    fertilizerType: "Калийное",
    typeGroup: "Калийные",
    tasks: ["Качество клубней", "Повышение урожайности", "Укрепление иммунитета"],
    elements: [
      { symbol: "K₂O", label: "Калий", value: "50%" },
      { symbol: "S", label: "Сера", value: "17%" }
    ],
    stage: ["Клубнеобразование", "Перед уборкой"],
    formula: "50%",
    bagTitle: "K₂O",
    bagSubtitle: "сульфат калия",
    bagTheme: "sulfat-kaliya",
    shortDescription: "Калийное удобрение для качества и лёжкости клубней.",
    description: "Сульфат калия используют как калийное удобрение без хлора, когда важны качество клубней, устойчивость к стрессу и хранение.",
    mainAction: "Повышает качество клубней и помогает растениям переносить стресс.",
    advantages: ["Без хлора", "Калий и сера", "Подходит для культур, чувствительных к хлору"],
    important: ["Не превышайте рекомендованные нормы", "Лучше вносить равномерно", "Хранить в сухом помещении"],
    application: "Основное внесение или подкормка по инструкции.",
    dosage: "Ориентировочно 60–140 кг/га. Точная норма зависит от почвы и технологии.",
    defaultNorm: 120,
    normUnit: "кг/га",
    recommendedRange: "60–140 кг/га",
    tags: ["сульфат калия", "калий", "без хлора"],
    imageTone: "gold"
  },
  {
    ...base,
    slug: "kalimagnesia",
    name: "Калимагнезия",
    shortName: "K₂O+MgO",
    category: "Калийные удобрения",
    fertilizerType: "Калийное",
    typeGroup: "Калийные",
    tasks: ["Качество клубней", "Укрепление иммунитета"],
    elements: [
      { symbol: "K₂O", label: "Калий", value: "30%" },
      { symbol: "MgO", label: "Магний", value: "10%" },
      { symbol: "S", label: "Сера" }
    ],
    stage: ["Подготовка почвы", "Клубнеобразование"],
    formula: "30+10",
    bagTitle: "K₂O+MgO",
    bagSubtitle: "для картофеля",
    bagTheme: "kalimagneziya",
    shortDescription: "Калий, магний и сера для качества клубней и фотосинтеза.",
    description: "Калимагнезия уместна, когда картофелю нужен калий вместе с магнием. Особенно полезна на лёгких и бедных магнием почвах.",
    mainAction: "Поддерживает качество клубней, фотосинтез и устойчивость растений.",
    advantages: ["Калий + магний", "Без хлора", "Хороша для лёгких почв"],
    important: ["Учитывайте магний в почве", "Не дублируйте калий без необходимости", "Проверяйте норму по инструкции"],
    application: "Основное внесение или подкормка по фазе культуры.",
    dosage: "Ориентировочно 80–160 кг/га.",
    defaultNorm: 110,
    normUnit: "кг/га",
    recommendedRange: "80–160 кг/га",
    tags: ["калимагнезия", "калий", "магний"],
    imageTone: "green"
  },
  {
    ...base,
    slug: "monopotassium-phosphate",
    name: "Монофосфат калия",
    shortName: "KH₂PO₄",
    category: "Фосфорно-калийные",
    fertilizerType: "Фосфорно-калийное",
    typeGroup: "Калийные",
    tasks: ["Качество клубней", "Повышение урожайности"],
    elements: [
      { symbol: "P₂O₅", label: "Фосфор", value: "52%" },
      { symbol: "K₂O", label: "Калий", value: "34%" }
    ],
    stage: ["Вегетация", "Клубнеобразование"],
    formula: "52%",
    bagTitle: "KH₂PO₄",
    bagSubtitle: "для картофеля",
    bagTheme: "monofosfat",
    shortDescription: "Растворимое фосфорно-калийное питание для подкормок.",
    description: "Монофосфат калия используют для подкормок, когда нужен фосфор и калий без азота. Нормы зависят от способа применения.",
    mainAction: "Поддерживает развитие клубней и качество урожая без дополнительного азота.",
    advantages: ["Фосфор + калий", "Без азота", "Подходит для подкормок"],
    important: ["Не превышайте концентрацию раствора", "Сверяйте совместимость", "Используйте по инструкции"],
    application: "Подкормки по фазе культуры, часто в растворимой форме.",
    dosage: "Точная норма зависит от способа применения и инструкции.",
    defaultNorm: 40,
    normUnit: "кг/га",
    recommendedRange: "20–60 кг/га",
    tags: ["монофосфат калия", "фосфор", "калий"],
    imageTone: "rose"
  },
  {
    ...base,
    slug: "potassium-nitrate",
    name: "Калиевая селитра",
    shortName: "KNO₃",
    category: "Калийно-азотные",
    fertilizerType: "Калийно-азотное",
    typeGroup: "Калийные",
    tasks: ["Рост и развитие", "Качество клубней"],
    elements: [
      { symbol: "K", label: "Калий" },
      { symbol: "N", label: "Азот" }
    ],
    stage: ["Вегетация", "Клубнеобразование"],
    formula: "K+N",
    bagTitle: "KNO₃",
    bagSubtitle: "калиевая селитра",
    bagTheme: "kalievaya-selitra",
    shortDescription: "Калий и нитратный азот для подкормки в период роста.",
    description: "Калиевая селитра сочетает калий и нитратный азот. Применяется там, где нужен рост и калийная поддержка.",
    mainAction: "Поддерживает рост растений и качество формирующегося урожая.",
    advantages: ["Калий + азот", "Подходит для подкормок", "Растворимая форма"],
    important: ["Учитывайте общий азот", "Не применяйте поздно без необходимости", "Сверяйте инструкцию"],
    application: "Подкормки по фазе культуры и инструкции.",
    dosage: "Норма уточняется по инструкции производителя.",
    defaultNorm: 80,
    normUnit: "кг/га",
    recommendedRange: "40–100 кг/га",
    tags: ["калиевая селитра", "калий", "азот"],
    imageTone: "gold"
  },
  {
    ...base,
    slug: "ammonium-sulfate",
    name: "Сульфат аммония",
    shortName: "(NH₄)₂SO₄",
    category: "Азотные удобрения",
    fertilizerType: "Азотное",
    typeGroup: "Азотные",
    tasks: ["Рост и развитие"],
    elements: [
      { symbol: "N", label: "Азот", value: "21%" },
      { symbol: "S", label: "Сера", value: "24%" }
    ],
    stage: ["Подготовка почвы", "Вегетация"],
    formula: "21%",
    bagTitle: "(NH₄)₂SO₄",
    bagSubtitle: "для картофеля",
    bagTheme: "sulfat-ammoniya",
    shortDescription: "Азот и сера для роста и серного питания.",
    description: "Сульфат аммония — азотное удобрение с серой. Уместен, когда нужно поддержать рост и добавить серу.",
    mainAction: "Поддерживает развитие ботвы и серное питание.",
    advantages: ["Азот + сера", "Подходит для весеннего питания", "Классическое азотное удобрение"],
    important: ["Учитывайте кислотность", "Не перекармливайте азотом", "Не заменяет калий"],
    application: "Основное внесение или подкормка по инструкции.",
    dosage: "Норма зависит от почвы и общей азотной схемы.",
    defaultNorm: 120,
    normUnit: "кг/га",
    recommendedRange: "80–160 кг/га",
    tags: ["сульфат аммония", "азот", "сера"],
    imageTone: "blue"
  },
  {
    ...base,
    slug: "ammonium-nitrate",
    name: "Аммиачная селитра",
    shortName: "N",
    category: "Азотные удобрения",
    fertilizerType: "Азотное",
    typeGroup: "Азотные",
    tasks: ["Рост и развитие"],
    elements: [{ symbol: "N", label: "Азот" }],
    stage: ["Вегетация"],
    formula: "N",
    bagTitle: "N",
    bagSubtitle: "аммиачная селитра",
    bagTheme: "ammiachnaya-selitra",
    shortDescription: "Азотное удобрение для активного роста.",
    description: "Аммиачная селитра — источник азота. Для картофеля важно не перекормить растения, чтобы не получить избыток ботвы.",
    mainAction: "Стимулирует рост зелёной массы.",
    advantages: ["Быстрый азотный эффект", "Подходит для раннего роста", "Распространённый продукт"],
    important: ["Контролируйте дозировку", "Соблюдайте правила хранения", "Не применяйте поздно без необходимости"],
    application: "Подкормка по фазе роста и инструкции.",
    dosage: "Норма зависит от общей азотной программы.",
    defaultNorm: 90,
    normUnit: "кг/га",
    recommendedRange: "40–120 кг/га",
    tags: ["аммиачная селитра", "азот"],
    imageTone: "blue"
  },
  {
    ...base,
    slug: "urea",
    name: "Карбамид / мочевина",
    shortName: "N",
    category: "Азотные удобрения",
    fertilizerType: "Азотное",
    typeGroup: "Азотные",
    tasks: ["Рост и развитие"],
    elements: [{ symbol: "N", label: "Азот" }],
    stage: ["Вегетация"],
    formula: "N",
    bagTitle: "CO(NH₂)₂",
    bagSubtitle: "карбамид",
    bagTheme: "karbamid",
    shortDescription: "Концентрированное азотное удобрение.",
    description: "Карбамид используют как азотное удобрение. Для картофеля важно учитывать сроки и не допускать избытка азота.",
    mainAction: "Поддерживает рост ботвы при нехватке азота.",
    advantages: ["Высокая концентрация азота", "Подходит для подкормок", "Широко применяется"],
    important: ["Есть риск перекорма азотом", "Соблюдайте сроки", "Сверяйте способ внесения"],
    application: "Внесение по инструкции с учётом влаги и фазы культуры.",
    dosage: "Норма зависит от технологии и фазы.",
    defaultNorm: 60,
    normUnit: "кг/га",
    recommendedRange: "30–90 кг/га",
    tags: ["карбамид", "мочевина", "азот"],
    imageTone: "blue"
  },
  {
    ...base,
    slug: "borofoska",
    name: "Борофоска",
    shortName: "B P K",
    category: "Микроудобрения",
    fertilizerType: "Микроудобрение / комплексное",
    typeGroup: "Микроудобрения",
    tasks: ["Качество клубней", "Корректировка почвы", "Укрепление иммунитета"],
    elements: [
      { symbol: "B", label: "Бор" },
      { symbol: "P", label: "Фосфор" },
      { symbol: "K", label: "Калий" },
      { symbol: "Ca", label: "Кальций" },
      { symbol: "Mg", label: "Магний" }
    ],
    stage: ["Подготовка почвы", "Посадка"],
    formula: "B P K",
    bagTitle: "B P₂O₅ K₂O",
    bagSubtitle: "борофоска",
    bagTheme: "borofoska",
    shortDescription: "Комплекс с бором, фосфором, калием, кальцием и магнием.",
    description: "Борофоска используется как комплексное удобрение с бором и макроэлементами. Перед применением важно учитывать почву и культуру.",
    mainAction: "Поддерживает питание и корректировку дефицитов в почве.",
    advantages: ["Содержит бор", "Есть фосфор и калий", "Подходит для подготовки почвы"],
    important: ["Не превышайте бор", "Смотрите инструкцию", "Учитывайте pH почвы"],
    application: "Внесение в почву до посадки или при подготовке участка.",
    dosage: "Норма зависит от состава конкретной борофоски.",
    defaultNorm: 100,
    normUnit: "кг/га",
    recommendedRange: "60–140 кг/га",
    tags: ["борофоска", "бор", "фосфор", "калий"],
    imageTone: "gold"
  },
  {
    ...base,
    slug: "dolomite-flour",
    name: "Доломитовая мука",
    shortName: "Ca Mg",
    category: "Улучшители почвы",
    fertilizerType: "Улучшитель почвы",
    typeGroup: "Улучшители почвы",
    tasks: ["Корректировка почвы"],
    elements: [
      { symbol: "Ca", label: "Кальций" },
      { symbol: "Mg", label: "Магний" }
    ],
    stage: ["Подготовка почвы"],
    formula: "Ca+Mg",
    bagTitle: "Ca Mg",
    bagSubtitle: "доломитовая мука",
    bagTheme: "dolomit",
    shortDescription: "Материал для раскисления и улучшения почвы.",
    description: "Доломитовая мука применяется для корректировки кислотности и внесения кальция с магнием.",
    mainAction: "Помогает улучшить кислотность почвы и структуру питания.",
    advantages: ["Кальций и магний", "Для кислых почв", "Работает как улучшитель"],
    important: ["Нужен учёт pH", "Действует постепенно", "Не смешивайте без проверки"],
    application: "Внесение при подготовке почвы, чаще заранее.",
    dosage: "Норма зависит от кислотности почвы.",
    defaultNorm: 300,
    normUnit: "кг/га",
    recommendedRange: "по pH почвы",
    tags: ["доломитовая мука", "кальций", "магний", "pH"],
    imageTone: "brown"
  },
  {
    ...base,
    slug: "wood-ash",
    name: "Древесная зола",
    shortName: "K Ca",
    category: "Натуральные",
    fertilizerType: "Натуральное / улучшитель почвы",
    typeGroup: "Натуральные",
    tasks: ["Корректировка почвы", "Качество клубней"],
    elements: [
      { symbol: "K", label: "Калий" },
      { symbol: "Ca", label: "Кальций" }
    ],
    stage: ["Подготовка почвы", "Посадка"],
    formula: "K+Ca",
    bagTitle: "K Ca",
    bagSubtitle: "древесная зола",
    bagTheme: "zola",
    shortDescription: "Натуральный источник калия и кальция.",
    description: "Древесная зола может использоваться как натуральный источник калия и кальция, но требует аккуратности при сочетании с другими удобрениями.",
    mainAction: "Добавляет калий и кальций, помогает корректировать почву.",
    advantages: ["Натуральный продукт", "Калий и кальций", "Подходит для почвы"],
    important: ["Состав золы нестабилен", "Не смешивайте с азотными без проверки", "Не применяйте на щелочных почвах без анализа"],
    application: "Внесение в почву по рекомендациям и с учётом pH.",
    dosage: "Норма зависит от состава золы и почвы.",
    defaultNorm: 50,
    normUnit: "кг/га",
    recommendedRange: "по анализу почвы",
    tags: ["зола", "калий", "кальций", "натуральное"],
    imageTone: "brown"
  }
];

export const brands = ["KartoFert"];
export const packageSizes = ["25 кг"];
export const fertilizerTypes = Array.from(new Set(products.map((product) => product.fertilizerType)));
export const typeGroups = ["Комплексные NPK", "Азотные", "Фосфорные", "Калийные", "Микроудобрения", "Улучшители почвы", "Натуральные"];
export const tasks = Array.from(new Set(products.flatMap((product) => product.tasks)));
export const elements = ["N", "P", "K", "Ca", "Mg", "S", "B", "Zn"];
export const stages = ["Подготовка почвы", "Посадка", "Вегетация", "Клубнеобразование", "Перед уборкой"];

export function findProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function formatProductPrice(product: Pick<Product, "price">) {
  if (typeof product.price !== "number") return "Цена уточняется";
  return `${product.price.toLocaleString("ru-RU")} BYN`;
}
