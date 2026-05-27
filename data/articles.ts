export type Article = {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  content: string;
  sections: { heading: string; paragraphs: string[] }[];
  tips: string[];
  mistakes: string[];
  checklist: string[];
  agronomistAdvice: string;
  relatedProductSlugs: string[];
};

const commonIntro =
  "Материал помогает покупателю разобраться в назначении удобрений и подготовиться к заказу. Точные нормы всегда нужно сверять с инструкцией производителя, состоянием почвы, сортом картофеля и технологией выращивания.";

function article({
  slug,
  title,
  category,
  date,
  excerpt,
  relatedProductSlugs,
  focus
}: {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  relatedProductSlugs: string[];
  focus: string;
}): Article {
  const sections = [
    {
      heading: "С чего начать",
      paragraphs: [
        commonIntro,
        `${focus} Важно не выбирать удобрение только по названию: смотрите элемент питания, фазу внесения, фасовку, цену за мешок и понятность инструкции.`
      ]
    },
    {
      heading: "Как читать состав",
      paragraphs: [
        "N отвечает за рост зелёной массы, P помогает старту корней, K влияет на качество и лёжкость клубней. Кальций, магний, сера и бор нужны не всегда, но могут быть важны на конкретных почвах.",
        "Если в карточке товара нет точной нормы или она отличается от вашей технологии, используйте калькулятор как ориентир и задайте норму вручную."
      ]
    },
    {
      heading: "Когда применять",
      paragraphs: [
        "Основное внесение делают при подготовке почвы или при посадке. Подкормки используют позже, если есть понятная задача: поддержать рост, добавить калий, скорректировать дефицит или улучшить качество клубней.",
        "Поздние азотные подкормки для картофеля требуют осторожности: избыток азота может усилить ботву и ухудшить качество урожая."
      ]
    },
    {
      heading: "Как не купить лишнее",
      paragraphs: [
        "Перед покупкой посчитайте площадь: для участка удобнее сотки, для хозяйства — гектары. Затем переведите норму в килограммы и количество мешков по 25 кг.",
        "Если цена требует уточнения, свяжитесь с KartoFert: подтвердим наличие, фасовку и актуальные условия."
      ]
    },
    {
      heading: "Что уточнить",
      paragraphs: [
        "Уточните наличие, дату поставки, документы, условия доставки и совместимость с выбранной схемой внесения. Для больших объёмов заранее согласуйте логистику.",
        "KartoFert помогает выбрать тип удобрения, рассчитать количество и перейти к контакту без лишней сложности."
      ]
    }
  ];

  return {
    slug,
    title,
    category,
    readTime: "7 минут",
    date,
    excerpt,
    relatedProductSlugs,
    content: sections.map((section) => `## ${section.heading}\n\n${section.paragraphs.join("\n\n")}`).join("\n\n"),
    sections,
    tips: [
      "Сначала определите задачу: старт, рост, калийное питание, корректировка почвы или натуральная добавка.",
      "Сравнивайте не только цену мешка, но и норму внесения, вес, состав и фазу применения.",
      "Для спорных схем оставляйте запас по времени на консультацию и доставку."
    ],
    mistakes: [
      "Брать азотное удобрение без понимания фазы роста.",
      "Смешивать золу, фосфорные и азотные продукты без проверки совместимости.",
      "Покупать мешки без расчёта площади и остатка после внесения."
    ],
    checklist: [
      "Площадь участка или поля",
      "Тип почвы и кислотность, если известны",
      "Цель внесения",
      "Норма с инструкции",
      "Количество мешков",
      "Условия доставки"
    ],
    agronomistAdvice:
      "Расчёт на сайте — ориентир для покупки. Перед внесением сверяйте норму с инструкцией на упаковке и не повышайте дозировку только ради быстрого эффекта."
  };
}

export const articles: Article[] = [
  article({
    slug: "chto-vnesti-pri-posadke-kartofelya",
    title: "Что внести при посадке картофеля: NPK, зола, борофоска или сульфат калия?",
    category: "Посадка",
    date: "20 мая 2026",
    excerpt: "Разбираем, чем отличаются варианты внесения при посадке и почему не стоит смешивать всё подряд.",
    relatedProductSlugs: ["npk-potato", "borofoska", "sulfate-potassium"],
    focus: "При посадке картофелю чаще всего нужны стартовый фосфор, умеренный азот и продуманный калий."
  }),
  article({
    slug: "kakie-udobreniya-nuzhny-kartofelyu-vesnoy",
    title: "Какие удобрения нужны картофелю весной",
    category: "Весна",
    date: "18 мая 2026",
    excerpt: "Весенняя схема начинается с почвы, площади и цели урожая, а не с покупки первого мешка NPK.",
    relatedProductSlugs: ["nitroammofoska-azofoska", "diammofoska", "ammofos"],
    focus: "Весной важно подготовить питание так, чтобы растение стартовало без перекоса в одну сторону."
  }),
  article({
    slug: "pochemu-kartofel-uhodit-v-botvu",
    title: "Почему картофель уходит в ботву, а клубней мало",
    category: "Ошибки",
    date: "15 мая 2026",
    excerpt: "Частая причина — избыток азота, поздние подкормки и отсутствие калийного баланса.",
    relatedProductSlugs: ["urea", "ammonium-nitrate", "sulfate-potassium"],
    focus: "Сильная ботва не всегда означает хороший урожай: важно смотреть на баланс питания."
  }),
  article({
    slug: "kaliy-dlya-kartofelya",
    title: "Калий для картофеля: сульфат калия, калимагнезия и качество клубней",
    category: "Калий",
    date: "12 мая 2026",
    excerpt: "Калий влияет на качество клубней, устойчивость и хранение. Сравниваем популярные варианты.",
    relatedProductSlugs: ["sulfate-potassium", "kalimagnesia", "monopotassium-phosphate"],
    focus: "Калийные удобрения особенно важны, когда цель — ровные клубни и хорошая лёжкость."
  }),
  article({
    slug: "sulfat-ammoniya-dlya-kartofelya",
    title: "Сульфат аммония для картофеля: когда он уместен",
    category: "Азот",
    date: "10 мая 2026",
    excerpt: "Сульфат аммония даёт азот и серу, но требует контроля кислотности и общей азотной схемы.",
    relatedProductSlugs: ["ammonium-sulfate", "dolomite-flour", "npk-potato"],
    focus: "Сульфат аммония уместен там, где нужен азот и сера, но его нельзя использовать без учёта почвы."
  }),
  article({
    slug: "borofoska-dlya-kartofelya",
    title: "Борофоска для картофеля: состав, задачи и ограничения",
    category: "Микроэлементы",
    date: "8 мая 2026",
    excerpt: "Борофоска может быть полезна при подготовке почвы, но бор нельзя вносить бездумно.",
    relatedProductSlugs: ["borofoska", "diammofoska", "dolomite-flour"],
    focus: "Борофоска — не универсальная волшебная смесь, а продукт с конкретными задачами и ограничениями."
  }),
  article({
    slug: "kak-rasschitat-udobreniya-na-sotki-i-gektary",
    title: "Как рассчитать удобрения для картофеля на сотки и гектары",
    category: "Расчёт",
    date: "6 мая 2026",
    excerpt: "Показываем логику расчёта: площадь, норма, килограммы, мешки и стоимость.",
    relatedProductSlugs: ["npk-potato", "sulfate-potassium", "kalimagnesia"],
    focus: "Для покупки важен простой перевод нормы в мешки: это экономит бюджет и место хранения."
  }),
  article({
    slug: "mozhno-li-sypat-zolu-pri-posadke-kartofelya",
    title: "Можно ли сыпать золу при посадке картофеля",
    category: "Натуральные",
    date: "3 мая 2026",
    excerpt: "Зола может быть источником калия и кальция, но её состав нестабилен и зависит от сырья.",
    relatedProductSlugs: ["wood-ash", "dolomite-flour", "sulfate-potassium"],
    focus: "Золу стоит рассматривать как аккуратную добавку, а не как замену всей схемы питания."
  }),
  article({
    slug: "udobrenie-pri-posadke-i-podkormka-posle-vshodov",
    title: "Чем отличается удобрение при посадке и подкормка после всходов",
    category: "Подкормки",
    date: "30 апреля 2026",
    excerpt: "Посадочное внесение работает на старт, а подкормки решают задачи текущей фазы роста.",
    relatedProductSlugs: ["ammofos", "monopotassium-phosphate", "potassium-nitrate"],
    focus: "Не каждое удобрение, которое подходит при посадке, стоит использовать после всходов."
  }),
  article({
    slug: "oshibki-pri-podkormke-kartofelya",
    title: "Ошибки при подкормке картофеля: азот, сроки, дозировки, почва",
    category: "Ошибки",
    date: "28 апреля 2026",
    excerpt: "Собрали частые ошибки, из-за которых подкормки не дают ожидаемого результата.",
    relatedProductSlugs: ["ammonium-nitrate", "urea", "kalimagnesia"],
    focus: "Ошибки чаще связаны не с самим товаром, а с неверной фазой, дозировкой и состоянием почвы."
  })
];

export function findArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
